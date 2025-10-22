'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlayCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Using Heroicons for consistency

export default function AddVideoForm() {
  const router = useRouter();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(.+)$/;
      if (!regex.test(youtubeUrl)) {
        throw new Error('Please enter a valid YouTube URL');
      }

      const response = await fetch('/api/videos/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process video');
      }

      // Redirect to video page
      router.push(`/videos/${data.videoId}`);
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10">
        <div className="mb-8 text-center">
          {/* Enhanced YouTube Icon */}
          <div className="flex justify-center mb-5">
            <div className="p-4 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-lg">
              <PlayCircleIcon className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Add YouTube Video</h2>
          <p className="mt-3 text-gray-300">
            Enter a YouTube video URL to process it for AI-powered Q&A.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-200 mb-2">
              YouTube Video URL
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <PlayCircleIcon className="h-5 w-5 text-gray-400" /> {/* Reusing PlayCircleIcon for consistency */}
              </div>
              <input
                id="youtubeUrl"
                name="youtubeUrl"
                type="text"
                required
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className="block w-full rounded-lg border-0 bg-white/5 py-3 pl-10 pr-10 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-colors duration-200"
                disabled={isLoading}
              />
              {youtubeUrl && (
                <button
                  type="button"
                  onClick={() => setYoutubeUrl('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none transition-colors"
                  disabled={isLoading}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Please paste a direct YouTube video URL (e.g., from your browser's address bar). Channel URLs will not work.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-300">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || !youtubeUrl}
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.01]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Video...
                </>
              ) : (
                <>
                  Process Video
                  <PlayCircleIcon className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </div>
          
          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-3">What happens next?</h3>
            <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
              <li>The video will be fetched and transcribed (this may take a few minutes for longer videos).</li>
              <li>Our AI will analyze the content to enable intelligent Q&A.</li>
              <li>You'll be automatically redirected to the video's dedicated chat page.</li>
              <li>Start asking questions and get instant, accurate answers from the video.</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}