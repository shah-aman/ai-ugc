import { NextRequest, NextResponse } from "next/server";
import { joinVideos } from "./services";
import { ExtractStructuredScriptSchema } from "../script/generate/schemas";
import { getSupabase } from "@/supabase/utils";

type RequestBody = {
  scriptId: string;
  mainVideoUrl: string;
  script: ExtractStructuredScriptSchema;
  brollVideos: string[];
  dimensions?: { width: number; height: number };
};

export async function POST(request: NextRequest) {
  try {
    const {
      scriptId,
      mainVideoUrl,
      script,
      brollVideos,
      dimensions,
    }: RequestBody = await request.json();

    if (!scriptId || !mainVideoUrl || !script || !brollVideos) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const {
      url: processed_video_link,
      error,
      scriptSegmentsWithTimestamps,
    } = await joinVideos(mainVideoUrl, script, brollVideos, dimensions);

    if (error) {
      return NextResponse.json(
        { error: `Video joining failed: ${error}` },
        { status: 500 },
      );
    }
    const supabase = getSupabase();
    const { error: updateError } = await supabase
      .from("scripts")
      .update({
        processed_video_link,
        structured_script: scriptSegmentsWithTimestamps,
        b_roll_used: brollVideos,
      })
      .eq("id", scriptId);

    if (updateError) {
      throw new Error(`Failed to update script: ${updateError.message}`);
    }

    return NextResponse.json({
      processed_video_link,
      scriptSegmentsWithTimestamps,
    });
  } catch (error) {
    console.error("Error in join route:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
