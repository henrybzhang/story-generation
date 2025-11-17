"use client";

import { useState } from 'react';
import { InputType } from '@/types/story';
import { useStoryData } from '@/features/home/hooks/useStoryData';
import { StoryManager } from '@/features/home/StoryManager';
import { AnalysisForm } from '@/features/home/AnalysisForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function HomePage() {
  const [inputType, setInputType] = useState<InputType>('text');

  // The hook remains the central source of truth for story data
  const {
    stories,
    activeStory,
    activeStoryId,
    isLoading: isStoryLoading,
    handlers,
  } = useStoryData();

  if (isStoryLoading) {
    return (
      <div className="min-h-screen bg-stone-100 flex justify-center items-center">
        <LoadingSpinner className="h-8 w-8" />
        <span className="ml-3 text-gray-700 text-lg">Loading Stories...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
          Story Analysis Tool
        </h1>

        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-2xl border border-gray-200/50">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Submit Your Story
          </h2>

          <StoryManager
            stories={stories}
            activeStory={activeStory}
            activeStoryId={activeStoryId}
            isLoading={isStoryLoading}
            handlers={handlers}
          />

          <AnalysisForm
            inputType={inputType}
            onInputTypeChange={setInputType}
            activeStory={activeStory}
            activeStoryId={activeStoryId}
            handlers={handlers}
            isStoryLoading={isStoryLoading}
          />
        </div>
      </div>
    </div>
  );
}