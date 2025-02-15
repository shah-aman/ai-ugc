const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_STATUS_URL = "https://api.heygen.com/v1/video_status.get";
const TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes in milliseconds
const POLLING_INTERVAL = 2000; // 2 seconds

interface VideoStatusResponse {
  data: {
    status: string;
    video_url?: string;
    thumbnail_url?: string;
    [key: string]: unknown;
  };
}

export async function fetchVideoStatus(
  videoId: string
): Promise<VideoStatusResponse> {
  const response = await fetch(`${HEYGEN_STATUS_URL}?video_id=${videoId}`, {
    method: "GET",
    headers: {
      "X-Api-Key": HEYGEN_API_KEY!,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch video status: ${response.status}`);
  }

  return response.json();
}

export async function pollVideoStatus(
  videoId: string,
  shouldPoll: boolean = true
) {
  if (!shouldPoll) {
    const response = await fetchVideoStatus(videoId);
    return response.data;
  }

  const startTime = Date.now();

  while (true) {
    const response = await fetchVideoStatus(videoId);
    const { data } = response;

    if (data.status === "completed" || data.status === "failed") {
      return data;
    }

    if (Date.now() - startTime > TIMEOUT_MS) {
      throw new Error("Timeout waiting for video");
    }

    await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
  }
}
