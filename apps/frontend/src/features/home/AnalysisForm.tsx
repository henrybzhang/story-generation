"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InputType } from '@/types/story';
import { StoryDataHandlers } from '@/features/home/hooks/useStoryData';
import { FullPageLoader } from '@/components/FullPageLoader'; // The inline spinner
import { FaFileUpload, FaFont, FaLink } from 'react-icons/fa';
import { AnalysisRequest, UserChapterData, UserStoryData } from '@story-generation/types';
import { TextInputForm } from './TextInputForm';
import { ChapterSelection } from './ChapterSelection';
import { startAnalysisJob } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
// Stub out the other forms for now
// import { LinkInputForm } from './forms/LinkInputForm';
// import { FileInputForm } from './forms/FileInputForm';

interface AnalysisFormProps {
  inputType: InputType;
  onInputTypeChange: (type: InputType) => void;
  activeStory: UserStoryData | null;
  activeStoryId: string;
  handlers: StoryDataHandlers;
  isStoryLoading: boolean;
}

export function AnalysisForm({
  inputType,
  onInputTypeChange,
  activeStory,
  activeStoryId,
  handlers,
  isStoryLoading,
}: AnalysisFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState(''); // State for other forms
  const [files, setFiles] = useState<FileList | null>(null); // State for other forms
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (activeStory && activeStory.chapters) {
      setSelectedChapters(activeStory.chapters.map((c) => c.number));
    }
  }, [activeStory]);

  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
  }

  // --- NEW Form Submission Logic ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStory) {
      setError('No active story to analyze.');
      return;
    }
    if (selectedChapters.length === 0) {
      setError('Please select at least one chapter to analyze.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let jobPayload: AnalysisRequest;

      if (inputType === 'text') {
        jobPayload = {
          storyId: activeStoryId,
          lastChapterNumber: Math.max(...selectedChapters),
        };
      } else if (inputType === 'link') {
        throw new Error('Link input is not yet implemented');
      } else {
        throw new Error('File input is not yet implemented');
      }
      
      // Call the API to *start* the job.
      await startAnalysisJob(inputType, jobPayload);

      // --- IMMEDIATE REDIRECT ---
      // Redirect the user to the new polling page.
      // The job ID is passed as a query param.
      router.push(`/analysis/${activeStoryId}`);

      // Note: We no longer set isSubmitting(false) here on success
      // because the user is navigating away.

    } catch (err) {
      console.error('Failed to start analysis job:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsSubmitting(false); // Only set back on error
    }
  };

  // --- Dynamic Input Renderer ---
  const renderInputType = () => {
    if (isStoryLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <FullPageLoader />
        </div>
      );
    }
    if (!activeStory) {
      return (
        <div className="flex justify-center items-center h-40">
          <span className="ml-3 text-gray-600">No active story found.</span>
        </div>
      );
    }

    switch (inputType) {
      case 'text':
        return <TextInputForm activeStory={activeStory} handlers={handlers} />;
      case 'link':
        return (
          <div>{/* ... LinkInputForm component would go here ... */}</div>
        );
      case 'file':
        return (
          <div>{/* ... FileInputForm component would go here ... */}</div>
        );
      default:
        return null;
    }
  };

  // --- STYLES for Input Type Switcher ---
  const baseStyle =
    'flex-1 flex justify-center items-center p-4 rounded-t-lg cursor-pointer transition-all duration-200 font-medium text-sm sm:text-base border-b-2';
  const activeStyle = 'bg-white text-blue-600 border-blue-600 shadow-sm';
  const inactiveStyle =
    'bg-gray-100 text-gray-500 hover:bg-gray-200 border-gray-200';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* --- Input Type Switcher --- */}
      <div className="flex w-full rounded-t-lg overflow-hidden border-b border-gray-200">
        <button
          type="button"
          onClick={() => onInputTypeChange('text')}
          className={`${baseStyle} ${
            inputType === 'text' ? activeStyle : inactiveStyle
          }`}
        >
          <FaFont className="mr-2" />
          Text Input
        </button>
        <button
          type="button"
          onClick={() => onInputTypeChange('link')}
          className={`${baseStyle} ${
            inputType === 'link' ? activeStyle : inactiveStyle
          }`}
        >
          <FaLink className="mr-2" />
          From Link
        </button>
        <button
          type="button"
          onClick={() => onInputTypeChange('file')}
          className={`${baseStyle} ${
            inputType === 'file' ? activeStyle : inactiveStyle
          }`}
        >
          <FaFileUpload className="mr-2" />
          Upload File
        </button>
      </div>

      {/* --- Rendered Input --- */}
      <div className="pt-4">{renderInputType()}</div>

      {activeStory && activeStory.chapters.length > 0 && (
        <ChapterSelection
          chapters={activeStory.chapters}
          selectedChapters={selectedChapters}
          onSelectedChaptersChange={setSelectedChapters}
        />
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* --- Submit Button --- */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting || isStoryLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner />
              Starting Analysis...
            </>
          ) : (
            'Analyze Story'
          )}
        </button>
      </div>
    </form>
  );
}