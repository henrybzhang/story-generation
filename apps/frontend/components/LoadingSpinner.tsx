"use client";

import React from 'react';

/**
 * A full-page loading spinner component.
 */
export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-xl font-semibold text-white">Analyzing your story...</p>
      <p className="text-gray-300">This may take a moment.</p>
    </div>
  );
};