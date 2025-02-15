import { NextRequest, NextResponse } from "next/server";
import { joinVideos } from "./services";
import { ExtractStructuredScriptSchema } from "../script/generate/schemas";

export async function POST(request: NextRequest) {
  try {
    const {
      mainVideoUrl,
      script,
      brollVideos,
      dimensions,
    }: {
      mainVideoUrl: string;
      script: ExtractStructuredScriptSchema;
      brollVideos: string[];
      dimensions?: { width: number; height: number };
    } = await request.json();

    if (!mainVideoUrl || !script || !brollVideos) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { url, error } = await joinVideos(
      mainVideoUrl,
      script,
      brollVideos,
      dimensions
    );

    if (error) {
      return NextResponse.json(
        { error: `Video joining failed: ${error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error in join route:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
