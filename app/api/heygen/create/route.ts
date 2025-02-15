import { NextResponse } from "next/server";
import { generateVideo } from "./services";

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

type RequestBody = {
  script: string;
  avatarId: string;
  voiceId: string;
};

export async function POST(request: Request) {
  try {
    const { script, avatarId, voiceId }: RequestBody = await request.json();

    if (!HEYGEN_API_KEY) {
      return NextResponse.json(
        { error: "HEYGEN_API_KEY not configured" },
        { status: 500 },
      );
    }

    const data = await generateVideo({ script, avatarId, voiceId });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating video:", error);

    if (error instanceof Error) {
      try {
        const errorDetails = JSON.parse(error.message);
        return NextResponse.json(
          {
            error: "Failed to generate video",
            details: errorDetails,
          },
          { status: 400 },
        );
      } catch {
        // If error message isn't JSON, return it directly
        return NextResponse.json({ error: error.message }, {
          status: 500,
        });
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
