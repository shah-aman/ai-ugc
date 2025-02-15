import { NextResponse } from "next/server";
import { pollVideoStatus } from "./services";
import { getSupabase } from "@/supabase/utils";

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

type RequestBody = {
  scriptId: string;
  videoId: string;
  shouldPoll: boolean;
};

export async function POST(request: Request) {
  const { scriptId, videoId, shouldPoll }: RequestBody = await request.json();

  if (!videoId) {
    return NextResponse.json(
      { error: "Video ID is required" },
      { status: 400 },
    );
  }

  if (!HEYGEN_API_KEY) {
    return NextResponse.json(
      { error: "HEYGEN_API_KEY not configured" },
      { status: 500 },
    );
  }

  try {
    const data = await pollVideoStatus(videoId, shouldPoll, 1000 * 60 * 5);
    const videoUrl: string | undefined | null = data.video_url;

    if (!videoUrl) {
      return NextResponse.json(
        { error: "Video URL not found" },
        { status: 404 },
      );
    }

    // Download video from HeyGen and upload to Supabase storage
    const videoResponse = await fetch(videoUrl);
    const videoBlob = await videoResponse.blob();

    const supabase = getSupabase();
    const fileName = `${videoId}.mp4`;
    const { error: storageError } = await supabase.storage
      .from("raw-videos")
      .upload(fileName, videoBlob, {
        contentType: "video/mp4",
        upsert: true,
      });

    if (storageError) {
      throw new Error("Failed to upload video to storage");
    }

    const { data: publicUrl } = supabase.storage
      .from("raw-videos")
      .getPublicUrl(fileName);

    const { data: videoData, error } = await supabase
      .from("scripts")
      .update({
        raw_video_link: publicUrl.publicUrl,
      })
      .eq("id", scriptId)
      .select();

    return NextResponse.json({ videoData, error });
  } catch (error) {
    console.error("Error polling video status:", error);

    if (
      error instanceof Error &&
      error.message === "Timeout waiting for video"
    ) {
      return NextResponse.json({ error: error.message }, { status: 408 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
