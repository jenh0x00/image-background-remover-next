'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [resultPreview, setResultPreview] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
      setError('Please upload PNG, JPG or JPEG images only');
      return;
    }
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalPreview(e.target?.result as string);
      setResultPreview('');
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image_file', selectedFile);
      formData.append('size', 'auto');

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process image. Please try again.');
      }

      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        setResultPreview(e.target?.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!resultPreview) return;

    const link = document.createElement('a');
    link.href = resultPreview;
    link.download = 'no-background.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setSelectedFile(null);
    setOriginalPreview('');
    setResultPreview('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🖼️ Image Background Remover
          </h1>
          <p className="text-lg opacity-90">
            Remove background from images instantly - free & online
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Upload Area */}
          {!originalPreview && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-3 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-indigo-300 hover:border-indigo-500 hover:bg-gray-50'
              }`}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <input
                id="fileInput"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleFileSelect}
              />
              <div className="text-6xl mb-4">📁</div>
              <p className="text-xl text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-400">
                PNG, JPG or JPEG (max 10MB)
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Preview Section */}
          {originalPreview && (
            <div className="mt-6">
              {/* Preview Images */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Original Image */}
                <div>
                  <p className="text-center text-gray-500 mb-2 font-medium">
                    Original
                  </p>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={originalPreview}
                      alt="Original"
                      width={400}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* Result Image */}
                <div>
                  <p className="text-center text-gray-500 mb-2 font-medium">
                    No Background
                  </p>
                  <div className="rounded-xl overflow-hidden shadow-lg checkerboard">
                    {resultPreview ? (
                      <Image
                        src={resultPreview}
                        alt="No Background"
                        width={400}
                        height={400}
                        className="w-full h-auto"
                      />
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center text-gray-400">
                        {isProcessing ? (
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-2"></div>
                            <p>Processing...</p>
                          </div>
                        ) : (
                          <p>Result will appear here</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {!resultPreview ? (
                  <button
                    onClick={processImage}
                    disabled={isProcessing}
                    className={`flex-1 py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all ${
                      isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 hover:-translate-y-0.5 hover:shadow-lg'
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      '✨ Remove Background'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={downloadImage}
                    className="flex-1 py-4 px-6 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:-translate-y-0.5 hover:shadow-lg transition-all"
                  >
                    ⬇️ Download Result
                  </button>
                )}

                <button
                  onClick={reset}
                  className="py-4 px-6 rounded-xl bg-gray-100 text-gray-600 font-semibold text-lg hover:bg-gray-200 transition-all"
                >
                  🔄 Try Another
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-white">
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold">Fast</h3>
            <p className="text-sm opacity-80">Process in seconds</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold">Secure</h3>
            <p className="text-sm opacity-80">No storage, in-memory</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎁</div>
            <h3 className="font-semibold">Free</h3>
            <p className="text-sm opacity-80">No signup required</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-white text-sm opacity-70">
          <p>Powered by Remove.bg API</p>
        </div>
      </div>
    </div>
  );
}
