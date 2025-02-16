// import { Database } from "@/supabase/types";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/supabase/utils";
import { generateVideo } from "../../heygen/create/services";
import { generateBRollVideos } from "../../broll-gen/services";
import { pollVideoStatus } from "../../heygen/get-video/services";
import { ExtractStructuredScriptSchema } from "../../script/generate/schemas";
import RunwayML from "@runwayml/sdk";
import { joinVideos } from "../../join/services";
import { generateZapcap } from "../../zapcap/generate/services";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import util from "util";
import { exec } from "child_process";
import mime from "mime-types";

// type ScriptRow = Database["public"]["Tables"]["scripts"]["Row"];

const execPromise = util.promisify(exec);

if (!process.env.HEYGEN_API_KEY) {
  throw new Error("HEYGEN_API_KEY is not set");
}

export type RequestBody = {
  scriptId: string;
  zapcapTemplateId: string;
};

async function getVideoDetails(videoUrl: string) {
  try {
    // Download the video file
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch video");
    }
    const buffer = Buffer.from(await response.arrayBuffer());

    // Get file format
    const contentType = response.headers.get("content-type");
    const urlExtension = path.extname(new URL(videoUrl).pathname).toLowerCase();
    let fileFormat = urlExtension.slice(1);
    if (!fileFormat && contentType) {
      fileFormat = mime.extension(contentType) || "";
    }

    // Create temp directory and save video
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "video-details-"));
    const tempFilePath = path.join(tempDir, "video.tmp");
    await fs.writeFile(tempFilePath, buffer);

    // Get video details using ffprobe
    const ffprobeCommand =
      `ffprobe -v quiet -print_format json -show_format -show_streams "${tempFilePath}"`;
    const { stdout } = await execPromise(ffprobeCommand);
    const probeData = JSON.parse(stdout);

    // Clean up temp files
    await fs.rm(tempDir, { recursive: true, force: true });

    // Extract video details
    const format = probeData.format;
    const duration = parseFloat(format.duration);

    const videoStream = probeData.streams.find(
      (s: { codec_type: string }) => s.codec_type === "video",
    );
    if (!videoStream) {
      throw new Error("No video stream found");
    }

    const width = videoStream.width;
    const height = videoStream.height;

    // Calculate framerate
    const rFrameRate = videoStream.r_frame_rate;
    let framerate = 0;
    if (rFrameRate && typeof rFrameRate === "string") {
      const [num, den] = rFrameRate.split("/").map(parseFloat);
      if (den !== 0) {
        framerate = num / den;
      }
    }

    return {
      duration,
      fileFormat: fileFormat.toLowerCase(),
      framerate,
      resolution: {
        width,
        height,
      },
    };
  } catch (error) {
    console.error("Error getting video details:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Starting video generation process...");
    const { scriptId, zapcapTemplateId }: RequestBody = await request.json();
    console.log("Request data:", { scriptId, zapcapTemplateId });
    const supabase = getSupabase();

    const { data: scriptRow, error: scriptError } = await supabase
      .from("scripts")
      .select("*")
      .eq("id", scriptId)
      .single();

    if (scriptError) {
      console.error("Failed to fetch script:", scriptError);
      return NextResponse.json({ error: scriptError.message }, { status: 500 });
    }

    console.log("Fetching influencer data...");
    const { data: influencerData, error: influencerError } = await supabase
      .from("influencers")
      .select("*")
      .eq("id", scriptRow.influencer_id)
      .single();

    if (influencerError) {
      console.error("Failed to fetch influencer:", influencerError);
      return NextResponse.json(
        { error: influencerError.message },
        { status: 500 },
      );
    }

    if (!influencerData) {
      console.error("Influencer not found for ID:", scriptRow.influencer_id);
      return NextResponse.json(
        { error: "Influencer not found" },
        {
          status: 404,
        },
      );
    }

    console.log("Influencer data retrieved:", {
      influencerId: influencerData.id,
      hasAvatar: !!influencerData.new_avatar_id,
      hasVoice: !!influencerData.voice_id,
    });

    const voice_id = influencerData.gender === "male"
      ? "26b2064088674c80b1e5fc5ab1a068ec"
      : "26b2064088674c80b1e5fc5ab1a068eb";

    const { full_script, structured_script, product_link } = scriptRow;

    if (!full_script) {
      console.error("Script is missing for ID:", scriptId);
      return NextResponse.json(
        { error: "Script is missing" },
        {
          status: 400,
        },
      );
    }

    if (!structured_script) {
      console.error("Structured script is missing for ID:", scriptId);
      return NextResponse.json(
        { error: "Structured script is missing" },
        {
          status: 400,
        },
      );
    }

    console.log("Fetching research data...");
    const { data: researchData, error: researchError } = await supabase
      .from("research")
      .select("*")
      .eq("product_link", product_link)
      .single();

    if (researchError) {
      console.error("Failed to fetch research:", researchError);
      return NextResponse.json(
        { error: researchError.message },
        {
          status: 500,
        },
      );
    }

    console.log("Research data retrieved for product:", product_link);

    const { top3ImageUrls } = researchData.product_info;
    if (!top3ImageUrls || top3ImageUrls.length === 0) {
      console.error("No image URLs found in research data");
      return NextResponse.json(
        { error: "No image urls found" },
        {
          status: 400,
        },
      );
    }

    const image_url: string = top3ImageUrls[0];

    console.log("Image URL:", image_url);

    if (!influencerData.new_avatar_id || !voice_id) {
      console.error("Missing avatar or voice ID:", {
        avatar_id: influencerData.new_avatar_id,
        voice_id,
      });
      return NextResponse.json(
        {
          error: "Influencer avatar_id or voice_id is missing",
        },
        { status: 400 },
      );
    }

    let mainVideoUrl: string | null = null;
    let brollVideoUrls: string[] = [];

    if (!scriptRow.state || scriptRow.state < 1) {
      console.log("Generating main video with HeyGen...");
      const generateResponse = await generateVideo({
        script: full_script,
        avatarId: influencerData.new_avatar_id,
        voiceId: voice_id,
      });
      const videoId = generateResponse.data.video_id;
      if (!videoId) {
        console.error("No video ID returned from HeyGen");
        return NextResponse.json(
          { error: "Failed to generate video" },
          {
            status: 500,
          },
        );
      }
      console.log("Starting parallel video processing...", videoId);
      const [videoObj, brollVideos] = await Promise.all([
        pollVideoStatus(videoId, true, 1000 * 60 * 5),
        generateBRollVideos(image_url, {
          script: structured_script,
        } as ExtractStructuredScriptSchema),
      ]);

      console.log("Video generation complete:", {
        hasMainVideo: !!videoObj.video_url,
        brollCount: brollVideos.length,
      });

      const videoUrl: string | undefined | null = videoObj.video_url;

      if (!videoUrl) {
        console.error("No video URL returned from HeyGen");
        return NextResponse.json(
          { error: "Failed to generate video" },
          {
            status: 500,
          },
        );
      }

      console.log("Uploading B-roll videos to storage...");
      // Upload videos and store metadata
      brollVideoUrls = await Promise.all(
        brollVideos.map(async (video) => {
          console.log("Processing B-roll video:", video.filename);
          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from("b-roll")
            .upload(video.filename, video.videoBuffer, {
              contentType: "video/mp4",
              upsert: true,
            });

          if (uploadError) {
            console.error("Failed to upload B-roll:", uploadError);
            throw new Error(`Failed to upload video: ${uploadError.message}`);
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from("b-roll")
            .getPublicUrl(video.filename);

          console.log("Storing B-roll metadata in database...");
          // Store in database
          const { error: dbError } = await supabase.from("b_roll").insert({
            product_link,
            description: video.description,
            video_link: urlData.publicUrl,
          });

          if (dbError) {
            console.error("Failed to store B-roll data:", dbError);
            throw new Error(`Failed to store B-roll data: ${dbError.message}`);
          }

          return urlData.publicUrl;
        }),
      );

      console.log("Downloading and uploading main video...");
      // Download video from HeyGen and upload to Supabase storage
      const videoResponse = await fetch(videoUrl);
      const videoBlob = await videoResponse.blob();

      const fileName = `${videoId}.mp4`;
      const { error: storageError } = await supabase.storage
        .from("raw-videos")
        .upload(fileName, videoBlob, {
          contentType: "video/mp4",
          upsert: true,
        });

      if (storageError) {
        console.error("Failed to upload main video to storage:", storageError);
        throw new Error("Failed to upload video to storage");
      }

      console.log("Main video uploaded, getting public URL...");
      const { data: publicUrl } = supabase.storage
        .from("raw-videos")
        .getPublicUrl(fileName);

      const { error: videoError } = await supabase
        .from("scripts")
        .update({
          raw_video_link: publicUrl.publicUrl,
        })
        .eq("id", scriptId)
        .select();

      if (videoError) {
        console.error("Failed to update video link in database:", videoError);
        throw new Error("Failed to update video link in database");
      }

      mainVideoUrl = publicUrl.publicUrl;

      await supabase
        .from("scripts")
        .update({
          state: 1,
          raw_video_link: publicUrl.publicUrl,
          b_roll_used: brollVideoUrls,
        })
        .eq("id", scriptId);

      scriptRow.state = 1;
    } else {
      mainVideoUrl = scriptRow.raw_video_link;
      brollVideoUrls = scriptRow.b_roll_used;
    }

    console.log("Starting video join process...");
    // JOIN VIDEOS
    const dimensions = { width: 720, height: 1280 };

    let joined_video_link: string | null = null;

    if (scriptRow.state == 1) {
      const {
        url: processed_video_link,
        error: joinVideosError,
        // scriptSegmentsWithTimestamps,
      } = await joinVideos(
        mainVideoUrl!,
        { script: structured_script } as ExtractStructuredScriptSchema,
        brollVideoUrls,
        dimensions,
      );

      if (joinVideosError) {
        console.error("Failed to join videos:", joinVideosError);
        throw new Error("Failed to join videos");
      }

      console.log("Videos joined successfully, updating script...");
      const { error: updateError } = await supabase
        .from("scripts")
        .update({
          processed_video_link,
          // structured_script: scriptSegmentsWithTimestamps,
          b_roll_used: brollVideoUrls,
          state: 2,
        })
        .eq("id", scriptId);

      if (updateError) {
        console.error(
          "Failed to update script with joined video:",
          updateError,
        );
        throw new Error(`Failed to update script: ${updateError.message}`);
      }

      scriptRow.state = 2;
      joined_video_link = processed_video_link;
    } else {
      joined_video_link = scriptRow.processed_video_link;
    }

    console.log("Generating captions with Zapcap...");

    let captioned_video_link: string | null = null;

    if (scriptRow.state == 2) {
      const { videoBuffer: captionedVideoBuffer, error: zapcapError } =
        await generateZapcap(joined_video_link!, zapcapTemplateId);

      if (zapcapError || !captionedVideoBuffer) {
        console.error("Failed to generate captions:", zapcapError);
        throw new Error("Failed to generate zapcap");
      }

      console.log("Uploading captioned video...");
      // Upload to Supabase storage
      const filename = `zapcap-${Date.now()}.mp4`;

      const { error: uploadError } = await supabase.storage
        .from("subtitled-videos")
        .upload(filename, captionedVideoBuffer, {
          contentType: "video/mp4",
          upsert: true,
        });

      if (uploadError) {
        console.error("Failed to upload captioned video:", uploadError);
        return NextResponse.json(
          { error: `Failed to upload video: ${uploadError.message}` },
          { status: 500 },
        );
      }

      console.log("Getting final video URL...");
      // Get public URL
      const { data: urlData } = supabase.storage
        .from("subtitled-videos")
        .getPublicUrl(filename);

      // Update scripts table
      const { error: scriptsUpdateError } = await supabase
        .from("scripts")
        .update({
          processed_video_link: urlData.publicUrl,
          state: 3,
        })
        .eq("id", scriptId);

      if (scriptsUpdateError) {
        console.error(
          "Failed to update script with final video:",
          scriptsUpdateError,
        );
        return NextResponse.json(
          { error: `Failed to update script: ${scriptsUpdateError.message}` },
          { status: 500 },
        );
      }

      scriptRow.state = 3;
      captioned_video_link = urlData.publicUrl;
    } else {
      captioned_video_link = scriptRow.processed_video_link;
    }

    console.log("Video generation process complete!");

    // Get video details before sending the response
    const videoDetails = await getVideoDetails(captioned_video_link!);

    return NextResponse.json({
      success: true,
      video_url: captioned_video_link!,
      video_details: videoDetails,
    });
  } catch (error) {
    console.error("Fatal error in video generation:", error);
    if (error instanceof RunwayML.APIError) {
      console.error("RunwayML API error:", {
        message: error.message,
        status: error.status,
      });
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error: "Failed to generate video" },
      {
        status: 500,
      },
    );
  }
}
