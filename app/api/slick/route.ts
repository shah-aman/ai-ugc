import { NextRequest, NextResponse } from "next/server";
import { addSubtitlesToVideo } from "./services";

type RequestBody = {
    videoId: string;
    theme: string;
};

export async function POST(request: NextRequest) {
    try {
        const { videoId, theme }: RequestBody = await request.json();

        if (!videoId || !theme) {
            return NextResponse.json(
                { error: "Video ID and theme are required" },
                { status: 400 },
            );
        }

        const { subtitled_video_link, error } = await addSubtitlesToVideo(
            videoId,
            theme,
        );

        if (error) {
            return NextResponse.json(
                { error: `Failed to add subtitles: ${error}` },
                { status: 500 },
            );
        }

        return NextResponse.json({ subtitled_video_link });
    } catch (error) {
        console.error("Error in Slick route:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 },
        );
    }
}
