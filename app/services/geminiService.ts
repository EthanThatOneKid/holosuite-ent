import type { ImageData } from '../types';

// Placeholder function - replace with actual API implementation
export const generateImage = async (prompt: string): Promise<ImageData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return placeholder base64 image (1x1 pixel)
  return {
    base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    mimeType: 'image/png',
  };
};

// Placeholder function - replace with actual API implementation
export const editImage = async (
  image: ImageData,
  prompt: string
): Promise<ImageData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return the same image for now
  return image;
};

// Placeholder function - replace with actual API implementation
export const generateVideo = async (
  image: ImageData,
  prompt: string
): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Return placeholder video URL
  return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
};
