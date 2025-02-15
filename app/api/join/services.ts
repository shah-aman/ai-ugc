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
}

interface JoinResponse {
  url: string;
  error?: string;
}

export async function joinVideos(
  mainVideoUrl: string,
  script: ExtractStructuredScriptSchema,
  brollVideos: string[],
  dimensions: { width: number; height: number } = {
    width: 720,
    height: 1280,
  }
): Promise<JoinResponse> {
  try {
    // Validate B-roll count matches
    const brollSegments = script.script.filter((s) => s.roll_type === "B-roll");
    if (brollSegments.length !== brollVideos.length) {
      throw new Error("Number of B-roll videos doesn't match script segments");
    }

    // Create temporary directory
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "video-join-"));

    // Download main video
    const mainVideoResponse = await fetch(mainVideoUrl);
    if (!mainVideoResponse.ok) {
      throw new Error("Failed to fetch main video");
    }
    const mainVideoBuffer = Buffer.from(await mainVideoResponse.arrayBuffer());
    const mainVideoPath = path.join(tempDir, "main.mp4");
    await fs.writeFile(mainVideoPath, mainVideoBuffer);

    // Extract audio for transcription
    const audioPath = path.join(tempDir, "audio.mp3");
    await execPromise(
      `ffmpeg -i "${mainVideoPath}" -vn -acodec libmp3lame "${audioPath}"`
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
      response_format: zodResponseFormat(BRollTimestampSchema, "timestamps"),
    });

    const brollTimestamps: BRollTimestampSchema | null =
      timestampResponse.choices[0].message.parsed;

    if (!brollTimestamps) {
      throw new Error("Failed to parse B-roll timestamps");
    }

    // Download and process B-roll videos
    const supabase = getSupabase();

    // List files in b-roll bucket for debugging
    const { data: files, error: listError } = await supabase.storage
      .from("b-roll")
      .list();

    if (listError) {
      throw new Error(`Failed to list b-roll files: ${listError.message}`);
    }

    console.log(
      "Available b-roll files:",
      files.map((f) => f.name)
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
          throw new Error(`File ${filename} not found in b-roll bucket`);
        }

        const { data: brollData, error: brollError } = await supabase.storage
          .from("b-roll")
          .download(filename);

        if (brollError) {
          console.error(`B-roll error details:`, brollError);
          throw new Error(
            `Failed to fetch B-roll video ${index}: ${brollError.message}`
          );
        }

        if (!brollData) {
          throw new Error(`No data received for B-roll video ${index}`);
        }

        const localPath = path.join(tempDir, `broll_${index}.mp4`);
        await fs.writeFile(
          localPath,
          Buffer.from(await brollData.arrayBuffer())
        );
        return localPath;
      })
    );

    // First extract the audio from the main video
    const mainAudioPath = path.join(tempDir, "main_audio.mp3");
    await execPromise(
      `ffmpeg -i "${mainVideoPath}" -vn -acodec libmp3lame "${mainAudioPath}"`
    );

    // Process video with B-roll overlays (without audio)
    const processedVideoPath = path.join(tempDir, "processed_video.mp4");
    let filterComplex = brollTimestamps.timestamps
      .map(
        (timestamp, index) => `
            [${index + 1}:v]trim=start=0:duration=${
          timestamp.end - timestamp.start
        },setpts=PTS-STARTPTS+${timestamp.start}/TB,scale=${dimensions.width}:${
          dimensions.height
        }:force_original_aspect_ratio=decrease,pad=${dimensions.width}:${
          dimensions.height
        }:(ow-iw)/2:(oh-ih)/2,setsar=1[v${index}];
        `
      )
      .join("");

    const overlay = brollTimestamps.timestamps.reduce((acc, _, index) => {
      const input = index === 0 ? "[0:v]" : `[tmp${index - 1}]`;
      const output =
        index === brollTimestamps.timestamps.length - 1
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
    const processVideoCommand = `ffmpeg ${inputFiles} -filter_complex "${filterComplex}" -map "[outv]" -c:v libx264 "${processedVideoPath}"`;

    await execPromise(processVideoCommand);

    // Combine processed video with original audio
    const outputPath = path.join(tempDir, "output.mp4");
    const combineCommand = `ffmpeg -i "${processedVideoPath}" -i "${mainAudioPath}" -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 "${outputPath}"`;

    await execPromise(combineCommand);

    // Read the output file
    const outputBuffer = await fs.readFile(outputPath);

    // Upload to Supabase
    const fileName = `joined-${Date.now()}.mp4`;

    const { error: uploadError } = await supabase.storage
      .from("joined-videos")
      .upload(fileName, outputBuffer, {
        contentType: "video/mp4",
        cacheControl: "3600",
      });

    if (uploadError) {
      throw new Error(`Failed to upload to Supabase: ${uploadError.message}`);
    }

    // Clean up temporary files
    await fs.rm(tempDir, { recursive: true, force: true });

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("joined-videos")
      .getPublicUrl(fileName);

    return {
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error("Error joining videos:", error);
    return {
      url: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
