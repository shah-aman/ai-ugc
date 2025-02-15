import { NextResponse } from "next/server";

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_API_URL = "https://api.heygen.com/v2/video/generate";

export async function POST(request: Request) {
  try {
    const { prompt, avatarId, voiceId } = await request.json();

    if (!HEYGEN_API_KEY) {
      return NextResponse.json(
        { error: "HEYGEN_API_KEY not configured" },
        { status: 500 }
      );
    }

    const videoPayload = {
      video_inputs: [
        {
          character: {
            type: "avatar",
            avatar_id: avatarId,
            scale: 1.0,
          },
          voice: {
            type: "text",
            voice_id: voiceId,
            input_text: prompt,
          },
          background: {
            type: "color",
            value: "#f6f6fc",
          },
        },
      ],
    };

    const response = await fetch(HEYGEN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": HEYGEN_API_KEY,
      },
      body: JSON.stringify(videoPayload),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: "Failed to generate video", details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating video:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
