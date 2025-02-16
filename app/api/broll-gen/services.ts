import RunwayML from "@runwayml/sdk";
import { ExtractStructuredScriptSchema } from "../script/generate/schemas";

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET,
});

async function waitForVideo(taskId: string): Promise<string> {
  while (true) {
    const task = await client.tasks.retrieve(taskId);

    if (task.status === "SUCCEEDED" && task.output) {
      return task.output[0];
    }

    if (task.status === "FAILED") {
      throw new Error("Video generation failed");
    }

    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}

interface GeneratedVideo {
  videoBuffer: Buffer;
  filename: string;
  content: string;
  description: string;
}

export async function generateBRollVideo(
  imageUrl: string,
  segment: ExtractStructuredScriptSchema["script"][0],
): Promise<GeneratedVideo> {
  const imageToVideo = await client.imageToVideo.create({
    model: "gen3a_turbo",
    promptImage: imageUrl,
    promptText: segment.description,
    ratio: "768:1280",
    duration: 5,
  });

  const outputUrl = await waitForVideo(imageToVideo.id);
  const videoResponse = await fetch(outputUrl);
  const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

  // Generate a unique filename with timestamp and random string
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const filename = `broll-${timestamp}-${randomString}.mp4`;

  return {
    videoBuffer,
    filename,
    content: segment.content,
    description: segment.description,
  };
}

export async function generateBRollVideos(
  imageUrl: string,
  script: ExtractStructuredScriptSchema,
): Promise<GeneratedVideo[]> {
  const bRollSegments = script.script.filter(
    (segment) => segment.roll_type === "B-roll-product" || segment.roll_type === "B-roll-generic",
  );

  const bRollVideos = await Promise.all(
    bRollSegments.map(async (segment) => {
      try {
        return await generateBRollVideo(segment.roll_type === "B-roll-product" ? imageUrl : "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/640px-A_black_image.jpg", segment);
      } catch (error) {
        console.error(
          `Failed to generate B-roll for segment: ${segment.content}`,
          error,
        );
        return null;
      }
    }),
  );

  const successfulVideos = bRollVideos.filter(
    (video): video is GeneratedVideo => video !== null,
  );

  if (successfulVideos.length === 0) {
    throw new Error("Failed to generate any B-roll videos");
  }

  return successfulVideos;
}
