import { getGroq } from "@/lib/ai";
import { getOpenAI } from "@/lib/ai";
import { getSupabase } from "@/supabase/utils";
import { ExtractStructuredScriptSchema } from "../script/generate/schemas";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { exec } from "child_process";
import util from "util";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { BRollTimestampSchema } from "./schemas";
const execPromise = util.promisify(exec);

interface TimestampedTranscript {
    text: string;
    start: number;
    end: number;
    roll_type: "A-roll" | "B-roll";
}

interface JoinResponse {
    url: string;
    error?: string;
    scriptSegmentsWithTimestamps: TimestampedTranscript[];
}

export async function joinVideos(
    mainVideoUrl: string,
    script: ExtractStructuredScriptSchema,
    brollVideos: string[],
    dimensions: { width: number; height: number } = {
        width: 720,
        height: 1280,
    },
): Promise<JoinResponse> {
    try {
        // Validate B-roll count matches
        const brollSegments = script.script.filter((s) =>
            s.roll_type === "B-roll-product" || s.roll_type === "B-roll-generic"
        );
        if (brollSegments.length !== brollVideos.length) {
            throw new Error(
                "Number of B-roll videos doesn't match script segments",
            );
        }

        // Create temporary directory
        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "video-join-"));

        // Download main video
        const mainVideoResponse = await fetch(mainVideoUrl);
        if (!mainVideoResponse.ok) {
            throw new Error("Failed to fetch main video");
        }
        const mainVideoBuffer = Buffer.from(
            await mainVideoResponse.arrayBuffer(),
        );
        const mainVideoPath = path.join(tempDir, "main.mp4");
        await fs.writeFile(mainVideoPath, mainVideoBuffer);

        // Extract audio for transcription
        const audioPath = path.join(tempDir, "audio.mp3");
        await execPromise(
            `ffmpeg -i "${mainVideoPath}" -vn -acodec libmp3lame "${audioPath}"`,
        );

        // Transcribe with Groq
        const groq = getGroq();
        const audioFile = await fs.readFile(audioPath);
        const transcription = await groq.audio.transcriptions.create({
            file: new File([audioFile], "audio.mp3", { type: "audio/mpeg" }),
            model: "whisper-large-v3",
            response_format: "verbose_json",
            temperature: 0.0,
        });

        const segments = (
            transcription as unknown as {
                segments: { text: string; start: number; end: number }[];
            }
        ).segments;

        if (!segments) {
            throw new Error("Failed to get transcription segments");
        }

        const transcript: TimestampedTranscript[] = segments.map((segment) => ({
            text: segment.text,
            start: segment.start,
            end: segment.end,
            roll_type: "A-roll",
        }));

        // Get B-roll timestamps using GPT-4
        const openai = getOpenAI();
        const timestampResponse = await openai.beta.chat.completions.parse({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert at matching script segments to audio timestamps.",
                },
                {
                    role: "user",
                    content: JSON.stringify({
                        script,
                        transcript,
                        task: "Match B-roll segments to transcript timestamps",
                    }),
                },
            ],
            response_format: zodResponseFormat(
                BRollTimestampSchema,
                "timestamps",
            ),
        });

        const brollTimestamps: BRollTimestampSchema | null =
            timestampResponse.choices[0].message.parsed;

        if (!brollTimestamps) {
            throw new Error("Failed to parse B-roll timestamps");
        }

        // After getting B-roll timestamps, construct complete script timeline
        const scriptTimeline: TimestampedTranscript[] = [];
        let currentTime = 0;

        script.script.forEach((segment) => {
            if (segment.roll_type === "A-roll") {
                // Find matching transcript segments for this A-roll
                const matchingSegments = transcript.filter(
                    (t) =>
                        t.start >= currentTime &&
                        (!brollTimestamps.timestamps.some(
                            (b) => t.start >= b.start && t.start < b.end,
                        )),
                );

                if (matchingSegments.length > 0) {
                    scriptTimeline.push({
                        text: segment.content,
                        start: matchingSegments[0].start,
                        end: matchingSegments[matchingSegments.length - 1].end,
                        roll_type: "A-roll",
                    });
                    currentTime =
                        matchingSegments[matchingSegments.length - 1].end;
                }
            } else {
                // B-roll segment
                const brollTimestamp = brollTimestamps.timestamps.find(
                    (t) => t.content === segment.content,
                );
                if (brollTimestamp) {
                    scriptTimeline.push({
                        text: segment.content,
                        start: brollTimestamp.start,
                        end: brollTimestamp.end,
                        roll_type: "B-roll",
                    });
                    currentTime = brollTimestamp.end;
                }
            }
        });

        // Sort timeline by start time
        scriptTimeline.sort((a, b) => a.start - b.start);

        // Download and process B-roll videos
        const supabase = getSupabase();

        // List files in b-roll bucket for debugging
        const { data: files, error: listError } = await supabase.storage
            .from("b-roll")
            .list();

        if (listError) {
            throw new Error(
                `Failed to list b-roll files: ${listError.message}`,
            );
        }

        console.log(
            "Available b-roll files:",
            files.map((f) => f.name),
        );

        const brollPaths = await Promise.all(
            brollVideos.map(async (brollPath, index) => {
                // Clean up the path - remove any URL components and get just the filename
                const filename = brollPath.split("/").pop()?.split("?")[0];
                if (!filename) {
                    throw new Error(`Invalid file path for B-roll ${index}`);
                }

                console.log(`Attempting to download: ${filename}`);

                // Verify file exists in bucket
                const fileExists = files.some((f) => f.name === filename);
                if (!fileExists) {
                    throw new Error(
                        `File ${filename} not found in b-roll bucket`,
                    );
                }

                const { data: brollData, error: brollError } = await supabase
                    .storage
                    .from("b-roll")
                    .download(filename);

                if (brollError) {
                    console.error(`B-roll error details:`, brollError);
                    throw new Error(
                        `Failed to fetch B-roll video ${index}: ${brollError.message}`,
                    );
                }

                if (!brollData) {
                    throw new Error(
                        `No data received for B-roll video ${index}`,
                    );
                }

                const localPath = path.join(tempDir, `broll_${index}.mp4`);
                await fs.writeFile(
                    localPath,
                    Buffer.from(await brollData.arrayBuffer()),
                );
                return localPath;
            }),
        );

        // First extract the audio from the main video
        const mainAudioPath = path.join(tempDir, "main_audio.mp3");
        await execPromise(
            `ffmpeg -i "${mainVideoPath}" -vn -acodec libmp3lame "${mainAudioPath}"`,
        );

        // Process video with B-roll overlays (without audio)
        const processedVideoPath = path.join(tempDir, "processed_video.mp4");
        let filterComplex = brollTimestamps.timestamps
            .map(
                (timestamp, index) => `
            [${
                    index + 1
                }:v]trim=start=0:duration=${5},setpts=PTS-STARTPTS+${timestamp.start}/TB,scale=${dimensions.width}:${dimensions.height}:force_original_aspect_ratio=decrease,pad=${dimensions.width}:${dimensions.height}:(ow-iw)/2:(oh-ih)/2,setsar=1[v${index}];
        `,
            )
            .join("");

        const overlay = brollTimestamps.timestamps.reduce((acc, _, index) => {
            const input = index === 0 ? "[0:v]" : `[tmp${index - 1}]`;
            const output = index === brollTimestamps.timestamps.length - 1
                ? "[outv]"
                : `[tmp${index}]`;
            return (
                acc +
                `${input}[v${index}]overlay=x=(W-w)/2:y=(H-h)/2:eof_action=pass${output};`
            );
        }, "");

        filterComplex += overlay;

        const inputFiles = [mainVideoPath, ...brollPaths]
            .map((p) => `-i "${p}"`)
            .join(" ");

        // Process video without audio
        const processVideoCommand =
            `ffmpeg ${inputFiles} -filter_complex "${filterComplex}" -map "[outv]" -c:v libx264 "${processedVideoPath}"`;

        await execPromise(processVideoCommand);

        // Combine processed video with original audio
        const outputPath = path.join(tempDir, "output.mp4");
        const combineCommand =
            `ffmpeg -i "${processedVideoPath}" -i "${mainAudioPath}" -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 "${outputPath}"`;
        await execPromise(combineCommand);

        // Overlay background music on top (very quiet, with fade in/out)
        // 1. Get video duration using ffprobe
        const durationCommand =
            `ffprobe -i "${outputPath}" -show_entries format=duration -v quiet -of csv="p=0"`;
        const { stdout: videoDurationStr } = await execPromise(durationCommand);
        const videoDuration = parseFloat(videoDurationStr.trim());

        // 2. Pick a random lofi track from 'music' bucket (lofi0.mp3 through lofi4.mp3)
        const randomIndex = Math.floor(Math.random() * 5);
        const musicFilename = `lofi${randomIndex}.mp3`;
        const { data: musicData, error: musicDownloadError } = await supabase
            .storage
            .from("music")
            .download(musicFilename);
        if (musicDownloadError || !musicData) {
            throw new Error(
                `Failed to download music file ${musicFilename}: ${musicDownloadError?.message}`,
            );
        }
        const musicPath = path.join(tempDir, musicFilename);
        await fs.writeFile(
            musicPath,
            Buffer.from(await musicData.arrayBuffer()),
        );

        // 3. Get music file duration via ffprobe
        const musicDurationCommand =
            `ffprobe -i "${musicPath}" -show_entries format=duration -v quiet -of csv="p=0"`;
        const { stdout: musicDurationStr } = await execPromise(
            musicDurationCommand,
        );
        const musicDuration = parseFloat(musicDurationStr.trim());

        // 4. Calculate a random offset so that the music clip has the same duration as the video
        let musicOffset = 0;
        if (musicDuration > videoDuration) {
            musicOffset = Math.random() * (musicDuration - videoDuration);
        }

        // 5. Mix the background music with the video's audio:
        //    - Trim and fade in/out the music (fade durations of 3 seconds)
        //    - Lower music volume to 0.1
        //    - Use amix filter to mix the original voice audio with the processed music
        const finalOutputPath = path.join(tempDir, "final_output.mp4");
        const mixCommand =
            `ffmpeg -i "${outputPath}" -ss ${musicOffset} -t ${videoDuration} -i "${musicPath}" -filter_complex "[1:a]afade=t=in:st=0:d=3,afade=t=out:st=${
                videoDuration - 3 < 0 ? 0 : videoDuration - 3
            }:d=3,volume=0.1[music];[0:a][music]amix=inputs=2:duration=first:dropout_transition=2[a]" -map 0:v -map "[a]" -c:v copy -c:a aac "${finalOutputPath}"`;
        await execPromise(mixCommand);

        // Read the final output file (with music overlay)
        const outputBuffer = await fs.readFile(finalOutputPath);

        // Upload to Supabase storage
        const fileName = `joined-${Date.now()}.mp4`;
        const { error: uploadError } = await supabase.storage
            .from("joined-videos")
            .upload(fileName, outputBuffer, {
                contentType: "video/mp4",
                cacheControl: "3600",
            });
        if (uploadError) {
            throw new Error(
                `Failed to upload to Supabase: ${uploadError.message}`,
            );
        }

        // Clean up temporary files
        await fs.rm(tempDir, { recursive: true, force: true });

        // Get public URL
        const { data: urlData } = supabase.storage
            .from("joined-videos")
            .getPublicUrl(fileName);

        return {
            url: urlData.publicUrl,
            scriptSegmentsWithTimestamps: scriptTimeline,
        };
    } catch (error) {
        console.error("Error joining videos:", error);
        return {
            url: "",
            error: error instanceof Error
                ? error.message
                : "Unknown error occurred",
            scriptSegmentsWithTimestamps: [],
        };
    }
}
