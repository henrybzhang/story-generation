"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FaFileUpload, FaFont, FaLink, FaPlus, FaTrash } from 'react-icons/fa';
import { InputType, Chapter } from '@/types/story'; // Import types
import { useStoryData } from '@/hooks/useStoryData'; // Import the hook
import { saveAnalysisResultToDB } from '@/lib/db'; // Import only the DB func we need
import { ChapterData } from '@story-generation/types';

export default function UploadPage() {
  const [inputType, setInputType] = useState<InputType>('text');
  const [link, setLink] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    stories,
    activeStory,
    activeStoryId,
    isLoading: isStoryLoading,
    handlers,
  } = useStoryData();

  if (!process.env.BACKEND_SERVER) {
    throw new Error('BACKEND_SERVER environment variable is not set');
  }

  // --- Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStory) {
      setError('No active story to analyze.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const BASE_URL = `${process.env.BACKEND_SERVER}/api/analyze`;
    let endpoint = '';
    let options: RequestInit = {};

    try {
      if (inputType === 'text') {
        endpoint = `${BASE_URL}/text`;
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storyData: activeStory.chapters.reduce((acc, chapter) => {
              acc[chapter.number] = {
                title: chapter.title,
                content: chapter.content,
              };
              return acc;
            }, {} as Record<number, ChapterData>),
          }),
        };
      } else if (inputType === 'link') {
        // ... (same as before)
      } else if (inputType === 'file') {
        // ... (same as before)
      }

      const response = await fetch(endpoint, options);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.error || `Error ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      await saveAnalysisResultToDB(activeStoryId, data);

      router.push(`/analysis?storyId=${activeStoryId}`);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsSubmitting(false); // Set back on error
    }
  };

  // --- Dynamic Input Renderer ---
  const renderInputType = () => {
    // Use the hook's loading state
    if (isStoryLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner className="h-6 w-6" />
          <span className="ml-3 text-gray-600">Loading story...</span>
        </div>
      );
    }

    // Handle case where story is loaded but (somehow) null
    if (!activeStory) {
      return (
         <div className="flex justify-center items-center h-40">
          <span className="ml-3 text-gray-600">No active story found.</span>
        </div>
      );
    }
    
    switch (inputType) {
      case 'text':
        return (
          <div className="space-y-6">
            {activeStory.chapters.map(chapter => (
              <div
                key={chapter.number}
                className="p-4 bg-gray-50 rounded-lg relative space-y-3 border border-gray-200 shadow-sm"
              >
                {activeStory.chapters.length > 1 && (
                  <button
                    type="button"
                    // Use handler from hook
                    onClick={() => handlers.handleRemoveChapter(chapter.number)}
                    className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform transform hover:scale-110"
                    aria-label="Remove Chapter"
                  >
                    <FaTrash size={12} />
                  </button>
                )}
                <label className="block text-sm font-medium text-gray-700">
                  Chapter Title (Optional)
                  <input
                    type="text"
                    value={chapter.title}
                    // Use handler from hook
                    onChange={e =>
                      handlers.handleChapterChange(chapter.number, 'title', e.target.value)
                    }
                    placeholder={`e.g., ${chapter.title}`}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Chapter Content
                  <textarea
                    value={chapter.content}
                    // Use handler from hook
                    onChange={e =>
                      handlers.handleChapterChange(chapter.number, 'content', e.target.value)
                    }
                    rows={10}
                    placeholder="Paste or write your chapter content here..."
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                    required
                  />
                </label>
              </div>
            ))}
            <button
              type="button"
              onClick={handlers.handleAddChapter} // Use handler
              className="w-full flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md shadow-lg transition-transform transform hover:scale-105"
            >
              <FaPlus className="mr-2" />
              Add Another Chapter
            </button>
          </div>
        );
      case 'link':
        // ... (same as before)
      case 'file':
        // ... (same as before)
      default:
        return null;
    }
  };

  // --- STYLES for Input Type Switcher ---
  // ... (same as before)
  const baseStyle = '...';
  const activeStyle = '...';
  const inactiveStyle = '...';

  // --- Main Render ---
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

          {/* --- Story Management UI (now uses hook) --- */}
          <div className="mb-8 p-4 bg-gray-100 rounded-lg border border-gray-300 space-y-4">
            <div className="flex flex-col sm:flex-row items-end sm:space-x-3">
              <div className="flex-grow w-full">
                <label
                  htmlFor="story-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Active Story Name
                </label>
                <input
                  type="text"
                  id="story-name"
                  value={activeStory?.name || ''}
                  onChange={handlers.handleStoryNameChange} // Use handler
                  className="mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={!activeStory || isStoryLoading}
                />
              </div>

              <div className="flex-shrink-0 w-full sm:w-auto">
                <label
                  htmlFor="story-select"
                  className="block text-sm font-medium text-gray-700 mt-3 sm:mt-0"
                >
                  Switch Story
                </label>
                <select
                  id="story-select"
                  value={activeStoryId}
                  onChange={e => handlers.handleStorySwitch(e.target.value)} // Use handler
                  disabled={isStoryLoading}
                  className="mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {stories.map(story => (
                    <option key={story.id} value={story.id}>
                      {story.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-2 justify-end">
              <button
                type="button"
                onClick={handlers.handleNewStory} // Use handler
                className="..."
                aria-label="New Story"
              >
                <FaPlus className="mr-2" size={12} />
                New Story
              </button>
              <button
                type="button"
                onClick={() => handlers.handleDeleteStory(activeStoryId)} // Use handler
                disabled={stories.length <= 1}
                className="..."
                aria-label="Delete Current Story"
              >
                <FaTrash className="mr-2" size={12} />
                Delete Story
              </button>
            </div>
          </div>
          {/* --- END Story Management UI --- */}

          {/* ... (Input Type Switcher - same as before) ... */}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderInputType()}

            {error && (
              <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || isStoryLoading} // Disable if loading or submitting
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isSubmitting ? ( // Use isSubmitting
                  <>
                    <LoadingSpinner className="h-5 w-5 mr-2" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Story'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}