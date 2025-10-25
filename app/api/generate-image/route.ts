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
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9'
      },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    if (base64ImageBytes) {
      return NextResponse.json({
        base64: base64ImageBytes,
        mimeType: 'image/jpeg',
      });
    }

    return NextResponse.json(
      { error: 'No image was generated from the prompt.' },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
