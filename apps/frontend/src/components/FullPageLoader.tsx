"use client";

import React from 'react';

interface FullPageLoaderProps {
  message?: string;
  subMessage?: string;
}

/**
 * A full-page loading spinner component, ideal for polling.
 */
export const FullPageLoader = ({
  message = 'Analyzing your story...',
  subMessage = 'This may take a moment.',
}: FullPageLoaderProps) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-xl font-semibold text-white">{message}</p>
      <p className="text-gray-300">{subMessage}</p>
    </div>
  );
};