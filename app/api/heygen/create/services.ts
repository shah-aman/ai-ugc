const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_API_URL = "https://api.heygen.com/v2/video/generate";

interface VideoGenerationPayload {
  prompt: string;
  avatarId: string;
  voiceId: string;
}

interface VideoResponse {
  data: {
    video_id: string;
    [key: string]: unknown;
  };
}

export async function generateVideo({
  prompt,
  avatarId,
  voiceId,
}: VideoGenerationPayload): Promise<VideoResponse> {
  const videoPayload = {
    dimension: {
      width: 720,
      height: 1280,
    },
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
      "X-Api-Key": HEYGEN_API_KEY!,
    },
    body: JSON.stringify(videoPayload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }

  return response.json();
}
