import { NextRequest, NextResponse } from "next/server";
import { substituteVoice } from "./services";

export async function POST(request: NextRequest) {
  try {
    const { videoUrl, voiceId } = await request.json();

    if (!videoUrl || !voiceId) {
      return NextResponse.json(
        { error: "Video URL and voice ID are required" },
        { status: 400 }
      );
    }

    const { url, chunks, error } = await substituteVoice(videoUrl, voiceId);

    if (error) {
      return NextResponse.json(
        { error: `Voice substitution failed: ${error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ url, chunks });
  } catch (error) {
    console.error("Error in voice substitution route:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
