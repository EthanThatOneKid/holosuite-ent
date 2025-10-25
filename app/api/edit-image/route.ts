import { GoogleGenAI, Modality } from '@google/genai';
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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: image.base64,
              mimeType: image.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return NextResponse.json({
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
        });
      }
    }

    return NextResponse.json(
      { error: 'No image was generated.' },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('Error editing image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to edit image' },
      { status: 500 }
    );
  }
}
