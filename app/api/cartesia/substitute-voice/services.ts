import { getSupabase } from "@/supabase/utils";
import { CartesiaClient } from "@cartesia/cartesia-js";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);
const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY;

interface VoiceSubstitutionResponse {
  url: string;
  chunks: Array<{
    timestamp: number;
    text: string;
  }>;
  error?: string;
}

export async function substituteVoice(
  videoUrl: string,
  voiceId: string
): Promise<VoiceSubstitutionResponse> {
  try {
    if (!CARTESIA_API_KEY) {
      throw new Error("CARTESIA_API_KEY not configured");
    }

    // Create temporary directory
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "voice-sub-"));

    // Download the video file
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error("Failed to fetch video file");
    }
    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
    const videoPath = path.join(tempDir, "input.mp4");
    await fs.writeFile(videoPath, videoBuffer);

    // Extract audio
    const audioPath = path.join(tempDir, "audio.mp3");
    await execPromise(
      `ffmpeg -i "${videoPath}" -vn -acodec libmp3lame "${audioPath}"`
    );

    // Initialize Cartesia client
    const cartesia = new CartesiaClient({ apiKey: CARTESIA_API_KEY });

    // Read audio file for Cartesia
    const audioBuffer = await fs.readFile(audioPath);
    const audioFile = new File([audioBuffer], "audio.mp3", {
      type: "audio/mp3",
    });

    // Process audio with Cartesia
    const modifiedAudioResponse = await cartesia.voiceChanger.bytes(audioFile, {
      voiceId,
      outputFormatContainer: "mp3",
      outputFormatSampleRate: 44100,
      outputFormatBitRate: 128000,
    });

    // Save modified audio
    const modifiedAudioPath = path.join(tempDir, "modified_audio.mp3");
    await fs.writeFile(modifiedAudioPath, Buffer.from(modifiedAudioResponse));

    // Merge audio back with video
    const outputPath = path.join(tempDir, "output.mp4");
    await execPromise(
      `ffmpeg -i "${videoPath}" -i "${modifiedAudioPath}" -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 "${outputPath}"`
    );

    // Read the output file
    const outputBuffer = await fs.readFile(outputPath);

    // Upload to Supabase
    const supabase = getSupabase();
    const fileName = `voice-sub-${Date.now()}.mp4`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from("voice-substitutions")
      .upload(filePath, outputBuffer, {
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
      .from("voice-substitutions")
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      chunks: [], // We can implement text chunks later if needed
    };
  } catch (error) {
    console.error("Error in voice substitution:", error);
    return {
      url: "",
      chunks: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
