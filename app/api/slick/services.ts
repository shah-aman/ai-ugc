import { getSupabase } from "@/supabase/utils";

const SLICK_API_KEY = process.env.SLICK_API_KEY;

interface SlickResponse {
    subtitled_video_link?: string;
    error?: string;
}

export async function addSubtitlesToVideo(
    videoId: string,
    theme: string,
): Promise<SlickResponse> {
    try {
        const supabase = getSupabase();

        // Get video data from scripts table
        const { data: videoData, error: fetchError } = await supabase
            .from("scripts")
            .select("*")
            .eq("id", videoId)
            .maybeSingle();

        if (fetchError || !videoData) {
            throw new Error(fetchError?.message || "Video not found");
        }

        // Create Slick project
        const createResponse = await fetch(
            "https://slick.is/api/project/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": SLICK_API_KEY!,
                },
                body: JSON.stringify({
                    videoUrl: videoData.processed_video_link,
                    theme,
                    language: "en",
                }),
            },
        );

        const { projectId } = await createResponse.json();

        console.log("Project ID:", projectId);

        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            throw new Error(`Failed to create Slick project: ${errorText}`);
        }

        const renderResponse = await fetch(
            "https://slick.is/api/project/render",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": SLICK_API_KEY!,
                },
                body: JSON.stringify({
                    projectId,
                    theme,
                }),
            },
        );

        if (!renderResponse.ok) {
            const errorText = await renderResponse.text();
            throw new Error(`Failed to render Slick project: ${errorText}`);
        }

        const { renderedVideoUrl } = await renderResponse.json();

        // Update scripts table
        const { error: updateError } = await supabase
            .from("scripts")
            .update({ processed_video_link: renderedVideoUrl })
            .eq("id", videoId);

        if (updateError) {
            throw new Error(`Failed to update script: ${updateError.message}`);
        }

        return { subtitled_video_link: renderedVideoUrl };
    } catch (error) {
        console.error("Error in addSubtitlesToVideo:", error);
        return {
            error: error instanceof Error
                ? error.message
                : "Unknown error occurred",
        };
    }
}
