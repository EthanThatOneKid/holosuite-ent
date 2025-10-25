import type { ImageData } from '../types';

export const generateImage = async (prompt: string): Promise<ImageData> => {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate image');
  }

  const data = await response.json();
  return {
    base64: data.base64,
    mimeType: data.mimeType,
  };
};

export const editImage = async (
  image: ImageData,
  prompt: string
): Promise<ImageData> => {
  const response = await fetch('/api/edit-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image, prompt }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to edit image');
  }

  const data = await response.json();
  return {
    base64: data.base64,
    mimeType: data.mimeType,
  };
};

export const generateVideo = async (
  image: ImageData,
  prompt: string
): Promise<string> => {
  const response = await fetch('/api/generate-video', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image, prompt }),
  });

  if (!response.ok) {
    const error = await response.json();
    if (error.error === 'API_KEY_INVALID') {
      throw new Error('API_KEY_INVALID');
    }
    throw new Error(error.error || 'Failed to generate video');
  }

  const data = await response.json();

  // Convert base64 to blob and create object URL
  const videoBlob = await fetch(`data:${data.mimeType};base64,${data.base64}`).then(r => r.blob());
  return URL.createObjectURL(videoBlob);
};
