const ZAPCAP_API_KEY = process.env.ZAPCAP_API_KEY;

interface ZapcapResponse {
  videoBuffer?: Buffer;
  error?: string;
}

export async function generateZapcap(
  videoUrl: string,
  templateId: string,
): Promise<ZapcapResponse> {
  try {
    // Upload the video to Zapcap
    const response = await fetch("https://api.zapcap.ai/videos/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": ZAPCAP_API_KEY!,
      },
      body: JSON.stringify({
        url: videoUrl,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate Zapcap: ${errorText}`);
    }

    const { id: videoId } = await response.json();
    console.log("Zapcap video is uploaded...", videoId);

    // Start the video processing
    console.log("Zapcap video is processing...");
    const startResponse = await fetch(
      `https://api.zapcap.ai/videos/${videoId}/task`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": ZAPCAP_API_KEY!,
        },
        body: JSON.stringify({
          autoApprove: true,
          templateId: templateId,
          renderOptions: {
            styleOptions: {
              // top: 65, // Position subtitles at 85% of video height (near bottom)
              top: 80, // Position subtitles at 85% of video height (near bottom)
              fontSize: 30,
            },
          },
        }),
      },
    );

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      throw new Error(`Failed to start Zapcap video: ${errorText}`);
    }

    const { taskId } = await startResponse.json();
    console.log("Task started with ID:", taskId);

    // Poll until the video is ready
    let downloadUrl: string | undefined;
    for (let i = 0; i < 120; i++) {
      const statusResponse = await fetch(
        `https://api.zapcap.ai/videos/${videoId}/task/${taskId}`,
        {
          headers: {
            "X-Api-Key": ZAPCAP_API_KEY!,
          },
        },
      );

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        throw new Error(`Failed to check task status: ${errorText}`);
      }

      const statusData = await statusResponse.json();
      console.log(`Attempt ${i + 1}/60: Status = ${statusData.status}`);

      if (statusData.status === "completed" && statusData.downloadUrl) {
        downloadUrl = statusData.downloadUrl;
        break;
      }

      if (statusData.status === "failed" || statusData.error) {
        throw new Error(
          `Task failed: ${statusData.error || "Unknown error"}`,
        );
      }

      // Wait 5 seconds before next check
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    if (!downloadUrl) {
      throw new Error("Timed out waiting for video processing");
    }

    // Download the video
    const videoResponse = await fetch(downloadUrl);
    if (!videoResponse.ok) {
      throw new Error("Failed to download processed video");
    }

    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
    return { videoBuffer };
  } catch (error) {
    console.error("Error in generateZapcap:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
