import { GoogleGenAI, Modality } from '@google/genai';
import type { ImageData } from '../types';

const getApiKey = (): string => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set.");
  }
  return apiKey;
}

// Placeholder function - replace with actual API implementation
export const generateImage = async (prompt: string): Promise<ImageData> => {
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
    return {
      base64: base64ImageBytes,
      mimeType: 'image/jpeg',
    };
  }

  throw new Error("No image was generated from the prompt.");
};

export const editImage = async (
  image: ImageData,
  prompt: string
): Promise<ImageData> => {
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
      return {
        base64: part.inlineData.data,
        mimeType: part.inlineData.mimeType,
      };
    }
  }

  throw new Error("No image was generated.");
};

export const generateVideo = async (
  image: ImageData,
  prompt: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  try {
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

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("Video generation succeeded but no download link was found.");
    }

    const response = await fetch(`${downloadLink}&key=${getApiKey()}`);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
  } catch (error: any) {
    if (error.message && error.message.includes("Requested entity was not found")) {
      throw new Error("API_KEY_INVALID");
    }
    throw error;
  }
};
