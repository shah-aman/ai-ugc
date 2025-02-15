import { NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";
import { generateBRollVideos } from "./services";
import { getSupabase } from "@/supabase/utils";
import { ExtractStructuredScriptSchema } from "../script/generate/schemas";

type RequestBody = {
  imageUrl: string;
  script: ExtractStructuredScriptSchema;
  product_link: string;
};

export async function POST(request: Request) {
  try {
    const { imageUrl, script, product_link }: RequestBody = await request
      .json();

    if (!imageUrl || !script || !product_link) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const videos = await generateBRollVideos(imageUrl, script);
    const supabase = getSupabase();

    console.log("Videos:", videos.length);

    // Upload videos and store metadata
    const uploadResults = await Promise.all(
      videos.map(async (video) => {
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from("b-roll")
          .upload(video.filename, video.videoBuffer, {
            contentType: "video/mp4",
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Failed to upload video: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("b-roll")
          .getPublicUrl(video.filename);

        // Store in database
        const { error: dbError } = await supabase
          .from("b_roll")
          .insert({
            product_link,
            description: video.description,
            video_link: urlData.publicUrl,
          });

        if (dbError) {
          throw new Error(`Failed to store B-roll data: ${dbError.message}`);
        }

        console.log("Stored B-roll data:", {
          product_link,
          description: video.description,
          video_link: urlData.publicUrl,
          video,
        });

        return {
          ...video,
          videoBuffer: undefined,
          video_link: urlData.publicUrl,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      videos: uploadResults,
    });
  } catch (error) {
    if (error instanceof RunwayML.APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
