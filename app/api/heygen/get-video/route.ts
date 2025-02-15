import { NextResponse } from "next/server";
import { pollVideoStatus } from "./services";

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");
  const shouldPoll = searchParams.get("poll") !== "false";

  if (!videoId) {
    return NextResponse.json(
      { error: "Video ID is required" },
      { status: 400 }
    );
  }

  if (!HEYGEN_API_KEY) {
    return NextResponse.json(
      { error: "HEYGEN_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const data = await pollVideoStatus(videoId, shouldPoll);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error polling video status:", error);

    if (
      error instanceof Error &&
      error.message === "Timeout waiting for video"
    ) {
      return NextResponse.json({ error: error.message }, { status: 408 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
