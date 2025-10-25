App.tsx
```ts
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fileToImageData } from './utils/fileUtils';
import { editImage, generateVideo, generateImage } from './services/geminiService';
import { VIDEO_GENERATION_MESSAGES } from './constants';
import type { ImageData } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import ApiKeyModal from './components/ApiKeyModal';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [generationPrompt, setGenerationPrompt] = useState<string>('');
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [videoPrompt, setVideoPrompt] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [isSelectingKey, setIsSelectingKey] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadingMessageIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeyReady(hasKey);
      }
    };
    checkApiKey();
  }, []);

  useEffect(() => {
    if (isLoading && loadingMessage === VIDEO_GENERATION_MESSAGES[0]) {
      let messageIndex = 0;
      loadingMessageIntervalRef.current = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % VIDEO_GENERATION_MESSAGES.length;
        setLoadingMessage(VIDEO_GENERATION_MESSAGES[messageIndex]);
      }, 4000);
    } else if (!isLoading && loadingMessageIntervalRef.current) {
      clearInterval(loadingMessageIntervalRef.current);
      loadingMessageIntervalRef.current = null;
    }

    return () => {
      if (loadingMessageIntervalRef.current) {
        clearInterval(loadingMessageIntervalRef.current);
      }
    };
  }, [isLoading, loadingMessage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setError(null);
        setVideoUrl(null);
        const imageData = await fileToImageData(file);
        setOriginalImage(imageData);
        setCurrentImage(imageData);
      } catch (err) {
        setError("Failed to load image. Please try another file.");
        console.error(err);
      }
    }
  };
  
  const handleGenerateImage = async () => {
    if (!generationPrompt.trim()) return;

    setIsLoading(true);
    setLoadingMessage('Generating your vision...');
    setError(null);
    setVideoUrl(null);
    setOriginalImage(null);
    setCurrentImage(null);

    try {
        const newImage = await generateImage(generationPrompt);
        setOriginalImage(newImage);
        setCurrentImage(newImage);
        setGenerationPrompt('');
    } catch (err: any) {
        setError(`Image generation failed: ${err.message}`);
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleEditImage = async () => {
    if (!currentImage || !editPrompt.trim()) return;

    setIsLoading(true);
    setLoadingMessage('Applying visual edits...');
    setError(null);
    try {
      const newImage = await editImage(currentImage, editPrompt);
      setCurrentImage(newImage);
      setEditPrompt('');
    } catch (err: any) {
      setError(`Image editing failed: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!currentImage || !videoPrompt.trim()) return;

    if (!apiKeyReady) {
      setShowApiKeyModal(true);
      return;
    }

    setIsLoading(true);
    setLoadingMessage(VIDEO_GENERATION_MESSAGES[0]);
    setError(null);
    setVideoUrl(null);

    try {
      const url = await generateVideo(currentImage, videoPrompt);
      setVideoUrl(url);
    } catch (err: any) {
      if (err.message === "API_KEY_INVALID") {
        setError("API key is invalid or expired. Please select a new one.");
        setApiKeyReady(false);
        setShowApiKeyModal(true);
      } else {
        setError(`Video generation failed: ${err.message}`);
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectKey = useCallback(async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      setIsSelectingKey(true);
      try {
        await window.aistudio.openSelectKey();
        setApiKeyReady(true);
        setShowApiKeyModal(false);
        setError(null);
      } catch (e) {
        setError("API key selection was cancelled.");
        console.error("API key selection error:", e);
      } finally {
        setIsSelectingKey(false);
      }
    } else {
        setError("API key selection feature is not available.");
    }
  }, []);

  const resetAll = () => {
    setOriginalImage(null);
    setCurrentImage(null);
    setVideoUrl(null);
    setError(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  }

  const commonTextAreaClasses = "w-full p-3 bg-gray-950/70 rounded-lg border border-gray-600 focus:outline-none focus:border-gray-300 focus:shadow-[0_0_15px_rgba(229,231,235,0.3)] transition-all duration-300 placeholder-gray-600";
  const primaryButtonClasses = "w-full font-bold py-2 px-4 rounded-lg transition-all duration-300 border-2 border-gray-400 text-gray-200 hover:bg-gray-500/20 hover:shadow-[0_0_15px_rgba(229,231,235,0.6)] hover:border-gray-200 disabled:border-gray-600 disabled:text-gray-500 disabled:shadow-none disabled:hover:bg-transparent";

  return (
    <div className="min-h-screen text-slate-200 font-mono flex flex-col">
      {showApiKeyModal && <ApiKeyModal onSelectKey={handleSelectKey} isSelectionInProgress={isSelectingKey}/>}
      <header className="bg-black/60 backdrop-blur-md p-4 border-b border-gray-700/50 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-200 tracking-wider hologram-text">
            Experience Generator
          </h1>
          {currentImage && <button onClick={resetAll} className="font-bold py-2 px-4 rounded-lg transition-all duration-300 border-2 border-red-500/50 text-red-400/80 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500">Start Over</button>}
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-950/50 p-6 rounded-xl shadow-lg border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-200" style={{ textShadow: '0 0 5px rgba(229, 231, 235, 0.7)' }}>
                1. Create Starting Image
              </h2>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Describe the initial scene for your experience.</p>
                <textarea
                  value={generationPrompt}
                  onChange={(e) => setGenerationPrompt(e.target.value)}
                  placeholder="Photorealistic image of an astronaut on Mars..."
                  rows={3}
                  className={commonTextAreaClasses}
                  disabled={isLoading}
                />
                <button
                  onClick={handleGenerateImage}
                  className={primaryButtonClasses}
                  disabled={isLoading || !generationPrompt.trim()}
                >
                  Generate Image
                </button>
              </div>

              <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="flex-shrink mx-4 text-gray-500 font-semibold">OR</span>
                <div className="flex-grow border-t border-gray-700"></div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Upload your own starting image.</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  disabled={isLoading}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-gray-500 file:bg-transparent file:text-sm file:font-semibold file:text-gray-300 hover:file:bg-gray-500/20 transition-all duration-300 cursor-pointer"
                />
              </div>
            </div>
            
            {currentImage && (
              <>
              <div className="bg-gray-950/50 p-6 rounded-xl shadow-lg border border-gray-700/50 backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-200" style={{ textShadow: '0 0 5px rgba(229, 231, 235, 0.7)' }}>
                  2. Edit Your Image
                </h2>
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="Change lighting to golden hour, add dense fog..."
                  rows={3}
                  className={commonTextAreaClasses}
                  disabled={isLoading}
                />
                <div className="flex justify-between items-center mt-4">
                  <button onClick={() => setCurrentImage(originalImage)} className="text-sm text-gray-400 hover:text-gray-200 transition" disabled={isLoading}>Reset to Original</button>
                  <button onClick={handleEditImage} className="font-bold py-2 px-4 rounded-lg transition-all duration-300 border-2 border-gray-400 text-gray-200 hover:bg-gray-500/20 hover:shadow-[0_0_15px_rgba(229,231,235,0.6)] hover:border-gray-200 disabled:border-gray-600 disabled:text-gray-500 disabled:shadow-none disabled:hover:bg-transparent" disabled={isLoading || !editPrompt.trim()}>
                    Apply Edit
                  </button>
                </div>
              </div>

              <div className="bg-gray-950/50 p-6 rounded-xl shadow-lg border border-gray-700/50 backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-200" style={{ textShadow: '0 0 5px rgba(229, 231, 235, 0.7)' }}>
                  3. Create a Video
                </h2>
                <textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="Slow pan across the landscape, clouds moving..."
                  rows={3}
                  className={commonTextAreaClasses}
                  disabled={isLoading}
                />
                 <button onClick={handleGenerateVideo} className="mt-4 w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 border-2 border-green-500/60 text-green-300 hover:bg-green-500/20 hover:shadow-[0_0_15px_rgba(34,197,94,0.6)] hover:border-green-400 disabled:border-gray-600 disabled:text-gray-500 disabled:shadow-none disabled:hover:bg-transparent" disabled={isLoading || !videoPrompt.trim()}>
                    Generate Video
                  </button>
              </div>
              </>
            )}
          </div>

          <div className="lg:col-span-2 bg-gray-950/50 p-4 rounded-xl shadow-lg border border-gray-700/50 backdrop-blur-sm min-h-[60vh] flex items-center justify-center">
            {isLoading ? (
              <div className="text-center">
                <LoadingSpinner className="w-16 h-16 mx-auto text-gray-300" />
                <p className="mt-4 text-lg animate-pulse text-gray-200">{loadingMessage}</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-300 bg-red-500/10 p-6 rounded-lg border border-red-500/50">
                <h3 className="font-bold text-lg mb-2">An Error Occurred</h3>
                <p>{error}</p>
              </div>
            ) : videoUrl ? (
                <video src={videoUrl} controls autoPlay loop className="max-w-full max-h-[80vh] rounded-lg shadow-2xl shadow-black" />
            ) : currentImage ? (
                <img src={`data:${currentImage.mimeType};base64,${currentImage.base64}`} alt="Current" className="max-w-full max-h-[80vh] rounded-lg shadow-2xl shadow-black" />
            ) : (
              <div className="text-center text-gray-600">
                <p className="text-2xl text-gray-500">Your generated experience will appear here.</p>
                <p>Start by describing a scene or uploading an image.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
```

ApiKeyModalProps.tsx
```ts
import React from 'react';

interface ApiKeyModalProps {
  onSelectKey: () => void;
  isSelectionInProgress: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSelectKey, isSelectionInProgress }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 font-mono">
      <div className="bg-gray-950/60 rounded-xl p-8 max-w-md w-full shadow-2xl shadow-gray-500/20 border border-gray-600/50 backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-200" style={{ textShadow: '0 0 8px rgba(229, 231, 235, 0.5)' }}>
          API Key Required
        </h2>
        <p className="mb-6 text-gray-300">
          Video generation with Veo requires a personal API key. Please select your key to proceed.
          This ensures your usage is correctly billed. For more information, please visit the{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:underline hover:text-white"
          >
            billing documentation
          </a>.
        </p>
        <button
          onClick={onSelectKey}
          disabled={isSelectionInProgress}
          className="w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 border-2 border-gray-400 text-gray-200 hover:bg-gray-500/20 hover:shadow-[0_0_15px_rgba(229,231,235,0.6)] hover:border-gray-200 disabled:border-gray-600 disabled:text-gray-500 disabled:shadow-none disabled:hover:bg-transparent flex items-center justify-center"
        >
          {isSelectionInProgress ? 'Opening Dialog...' : 'Select API Key'}
        </button>
      </div>
    </div>
  );
};

export default ApiKeyModal;
```

LoadingSpinnerProps.tsx
```ts
import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = 'w-8 h-8' }) => {
  return (
    <svg 
      className={`animate-spin ${className} text-white`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export default LoadingSpinner;
```

fileUtils.ts
```ts
import type { ImageData } from '../types';

export const fileToImageData = (file: File): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};
```

geminiService.ts
```ts
import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageData } from '../types';

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
  }
  return apiKey;
};

export const generateImage = async (prompt: string): Promise<ImageData> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '16:9',
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
```
