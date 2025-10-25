'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fileToImageData } from './utils/fileUtils';
import { editImage, generateVideo, generateImage } from './services/geminiService';
import { VIDEO_GENERATION_MESSAGES } from './constants';
import type { ImageData } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import ApiKeyModal from './components/ApiKeyModal';

export default function Home() {
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
    // Check if API key is available
    setApiKeyReady(true); // Placeholder - set to true by default
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
    setIsSelectingKey(true);
    try {
      // Placeholder - simulate key selection
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApiKeyReady(true);
      setShowApiKeyModal(false);
      setError(null);
    } catch (e) {
      setError("API key selection was cancelled.");
      console.error("API key selection error:", e);
    } finally {
      setIsSelectingKey(false);
    }
  }, []);

  const resetAll = () => {
    setOriginalImage(null);
    setCurrentImage(null);
    setVideoUrl(null);
    setError(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="min-h-screen bg-base-200">
      {showApiKeyModal && <ApiKeyModal onSelectKey={handleSelectKey} isSelectionInProgress={isSelectingKey}/>}

      {/* Header */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Experience Generator</a>
        </div>
        {currentImage && (
          <div className="flex-none">
            <button onClick={resetAll} className="btn btn-error btn-outline">
              Start Over
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">

            {/* Step 1: Create Starting Image */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">1. Create Starting Image</h2>
                <p className="text-sm opacity-70">Describe the initial scene for your experience.</p>

                <textarea
                  value={generationPrompt}
                  onChange={(e) => setGenerationPrompt(e.target.value)}
                  placeholder="Photorealistic image of an astronaut on Mars..."
                  rows={3}
                  className="textarea textarea-bordered w-full"
                  disabled={isLoading}
                />

                <button
                  onClick={handleGenerateImage}
                  className="btn btn-primary"
                  disabled={isLoading || !generationPrompt.trim()}
                >
                  Generate Image
                </button>

                <div className="divider">OR</div>

                <div>
                  <p className="text-sm opacity-70 mb-2">Upload your own starting image.</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    disabled={isLoading}
                    className="file-input file-input-bordered w-full"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Edit Your Image */}
            {currentImage && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">2. Edit Your Image</h2>

                  <textarea
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Change lighting to golden hour, add dense fog..."
                    rows={3}
                    className="textarea textarea-bordered w-full"
                    disabled={isLoading}
                  />

                  <div className="flex justify-between items-center gap-2">
                    <button
                      onClick={() => setCurrentImage(originalImage)}
                      className="btn btn-ghost btn-sm"
                      disabled={isLoading}
                    >
                      Reset to Original
                    </button>
                    <button
                      onClick={handleEditImage}
                      className="btn btn-primary"
                      disabled={isLoading || !editPrompt.trim()}
                    >
                      Apply Edit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Create a Video */}
            {currentImage && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">3. Create a Video</h2>

                  <textarea
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder="Slow pan across the landscape, clouds moving..."
                    rows={3}
                    className="textarea textarea-bordered w-full"
                    disabled={isLoading}
                  />

                  <button
                    onClick={handleGenerateVideo}
                    className="btn btn-success"
                    disabled={isLoading || !videoPrompt.trim()}
                  >
                    Generate Video
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Display Area */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl min-h-[60vh]">
              <div className="card-body items-center justify-center">
                {isLoading ? (
                  <div className="text-center">
                    <LoadingSpinner className="w-16 h-16" />
                    <p className="mt-4 text-lg">{loadingMessage}</p>
                  </div>
                ) : error ? (
                  <div className="alert alert-error">
                    <div>
                      <h3 className="font-bold">An Error Occurred</h3>
                      <p>{error}</p>
                    </div>
                  </div>
                ) : videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="max-w-full max-h-[80vh] rounded-lg"
                  />
                ) : currentImage ? (
                  <img
                    src={`data:${currentImage.mimeType};base64,${currentImage.base64}`}
                    alt="Current"
                    className="max-w-full max-h-[80vh] rounded-lg"
                  />
                ) : (
                  <div className="text-center opacity-50">
                    <p className="text-2xl mb-2">Your generated experience will appear here.</p>
                    <p>Start by describing a scene or uploading an image.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
