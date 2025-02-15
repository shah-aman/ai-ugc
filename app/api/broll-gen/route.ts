import { NextResponse } from 'next/server';
import RunwayML from '@runwayml/sdk';
import fs from 'fs';
import path from 'path';
import { ExtractStructuredScriptSchema } from '../script/generate/schemas';

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET,
});

const VIDEOS_DIR = path.join(process.cwd(), 'public', 'videos');

if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

async function waitForVideo(taskId: string): Promise<string> {
  while (true) {
    const task = await client.tasks.retrieve(taskId);
    
    if (task.status === 'SUCCEEDED' && task.output) {
      return task.output[0];
    }
    
    if (task.status === 'FAILED') {
      throw new Error('Video generation failed');
    }
    
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
}

async function generateBRollVideo(imageUrl: string, segment: ExtractStructuredScriptSchema['script'][0]): Promise<{
  filename: string;
  path: string;
}> {
  const imageToVideo = await client.imageToVideo.create({
    model: 'gen3a_turbo',
    promptImage: imageUrl,
    promptText: segment.description,
    ratio: '768:1280',
    duration: 5
  });

  const outputUrl = await waitForVideo(imageToVideo.id);
  const videoResponse = await fetch(outputUrl);
  const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
  
  const filename = `video-${Date.now()}.mp4`;
  const filePath = path.join(VIDEOS_DIR, filename);
  
  fs.writeFileSync(filePath, videoBuffer);

  console.log('filename', filename);
  console.log('gen-description-info', segment.description);
  console.log('gen-content-info', segment.content);

  return {
    filename,
    path: `/videos/brollgen/${filename}`
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, script } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    if (!script) {
      return NextResponse.json(
        { error: 'Script is required' },
        { status: 400 }
      );
    }

    const bRollSegments = script.script.filter(
      (segment: ExtractStructuredScriptSchema['script'][0]) => 
        segment.roll_type === 'B-roll'
    );

    const bRollVideos = await Promise.all(
      bRollSegments.map(async (segment: ExtractStructuredScriptSchema['script'][0]) => {
        try {
          const video = await generateBRollVideo(imageUrl, segment);
          return {
            content: segment.content,
            description: segment.description,
            ...video
          };
        } catch (error) {
          console.error(`Failed to generate B-roll for segment: ${segment.content}`, error);
          return null;
        }
      })
    );

    const successfulVideos = bRollVideos.filter(Boolean);

    if (successfulVideos.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate any B-roll videos' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      videos: successfulVideos
    });

  } catch (error) {
    if (error instanceof RunwayML.APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
