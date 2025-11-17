"use client";

import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

/**
 * A small, inline loading spinner that accepts a className for sizing.
 */
export const LoadingSpinner = ({ className = 'h-5 w-5' }: LoadingSpinnerProps) => {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};