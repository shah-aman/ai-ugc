import { NextRequest, NextResponse } from "next/server";
import { generateZapcap } from "./services";
import { getSupabase } from "@/supabase/utils";

export async function POST(request: NextRequest) {
    try {
        const { videoUrl, scriptId } = await request.json();

        if (!videoUrl || !scriptId) {
            return NextResponse.json(
                { error: "URL and scriptId are required" },
                { status: 400 },
            );
        }

        const { videoBuffer, error } = await generateZapcap(videoUrl);

        if (error || !videoBuffer) {
            return NextResponse.json(
                { error: error || "Failed to generate video" },
                { status: 500 },
            );
        }

        // Upload to Supabase storage
        const supabase = getSupabase();
        const filename = `zapcap-${Date.now()}.mp4`;

        const { error: uploadError } = await supabase.storage
            .from("subtitled-videos")
            .upload(filename, videoBuffer, {
                contentType: "video/mp4",
                upsert: true,
            });

        if (uploadError) {
            return NextResponse.json(
                { error: `Failed to upload video: ${uploadError.message}` },
                { status: 500 },
            );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from("subtitled-videos")
            .getPublicUrl(filename);

        // Update scripts table
        const { error: updateError } = await supabase
            .from("scripts")
            .update({ processed_video_link: urlData.publicUrl })
            .eq("id", scriptId);

        if (updateError) {
            return NextResponse.json(
                { error: `Failed to update script: ${updateError.message}` },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success: true,
            video_url: urlData.publicUrl,
        });
    } catch (error) {
        console.error("Error in Zapcap route:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 },
        );
    }
}
