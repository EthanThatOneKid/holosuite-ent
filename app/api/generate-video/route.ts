import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const getApiKey = (): string => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set in environment variables.");
  }
  return apiKey;
};

export async function POST(request: Request) {
  try {
    const { image, prompt } = await request.json();

    if (!image || !image.base64 || !image.mimeType) {
      return NextResponse.json(
        { error: 'Image data is required with base64 and mimeType' },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: getApiKey() });

    // Start video generation
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: {
        imageBytes: image.base64,
        mimeType: image.mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Poll until video is ready
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      return NextResponse.json(
        { error: 'Video generation succeeded but no download link was found.' },
        { status: 500 }
      );
    }

    // Fetch the video
    const response = await fetch(`${downloadLink}&key=${getApiKey()}`);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    // Convert video to base64 to send to client
    const videoBuffer = await response.arrayBuffer();
    const base64Video = Buffer.from(videoBuffer).toString('base64');

    return NextResponse.json({
      base64: base64Video,
      mimeType: 'video/mp4',
    });
  } catch (error: any) {
    console.error('Error generating video:', error);

    if (error.message && error.message.includes("Requested entity was not found")) {
      return NextResponse.json(
        { error: 'API_KEY_INVALID' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate video' },
      { status: 500 }
    );
  }
}
