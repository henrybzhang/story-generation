'use client';

import { Suspense, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { FaCopy, FaCheck } from 'react-icons/fa';
import { useAnalysisData } from '@/features/analysis/hooks/useAnalysisData';
import { FullPageLoader } from '@/components/FullPageLoader';
import { AnalysisJobSelector } from '@/features/analysis/AnalysisJobSelector';
import { IndirectAnalysisView } from '@/features/analysis/IndirectAnalysisView';
import { DirectAnalysisView } from '@/features/analysis/DirectAnalysisView';
import { buildMasterPrompt } from '@/features/analysis/utils/buildMasterPrompt';
import { AnalysisMethod } from '@story-generation/types';
import { deleteAnalysisJobs } from '@/lib/api';

/**
 * Main content of the analysis page.
 */
function AnalysisPageContent() {
  // --- STATE ---
  const params = useParams();

  const storyId = params.storyId as string;
  const queryClient = useQueryClient();


  const [masterPrompt, setMasterPrompt] = useState('Loading story context...');
  const [userDirection, setUserDirection] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // ★ The hook provides all data and loading states
  const {
    jobList,
    jobData,
    isLoading,
    error,
    isPolling,
    pollingMessage,
  } = useAnalysisData(storyId, selectedJobId);

  // --- EFFECTS ---

  // When the page loads, invalidate the jobs list to ensure we get the latest data
  useEffect(() => {
    if (storyId) {
      queryClient.invalidateQueries({ queryKey: ['jobs', storyId] });
    }
  }, [storyId, queryClient]);

  // On Data Load: Re-build the master prompt
  useEffect(() => {
    if (jobData) {
      setMasterPrompt(
        buildMasterPrompt(jobData)
      );
    }
  }, [jobData]);

  // --- HANDLERS ---

  const handleToggleChapter = (chapterKey: string) => {
    setOpenChapters((prev) => ({ ...prev, [chapterKey]: !prev[chapterKey] }));
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(masterPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // --- RENDER CONDITIONS ---

  // 1. Loading State (Covers both list and job polling)
  if (isLoading) {
    return (
      <FullPageLoader
        message={pollingMessage || 'Loading Analysis...'}
        subMessage={isPolling ? 'This may take a moment...' : ''}
      />
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="min-h-screen bg-stone-100 text-gray-900 flex items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Error Loading Analysis
        </h2>
        <p className="bg-red-100 p-4 rounded-md text-red-800">{error}</p>
      </div>
    );
  }

  // Handler for deleting jobs
  const handleDeleteJobs = async (jobIds: string[]) => {
    await deleteAnalysisJobs(jobIds);
    // Invalidate and refetch the jobs list
    await queryClient.invalidateQueries({ queryKey: ['jobs', storyId] });
  };

  // 3. Show job selector if no job is selected
  if (!selectedJobId) {
    return (
      <AnalysisJobSelector
        jobs={jobList || []}
        onJobSelect={setSelectedJobId}
        selectedJobId={selectedJobId}
        onDeleteJobs={handleDeleteJobs}
      />
    );
  }

  // 4. Show loading for the selected job
  if (isLoading) {
    return <FullPageLoader message="Loading analysis details..." />;
  }

  // 5. Show error for the selected job
  if (error) {
    return (
      <div className="min-h-screen bg-stone-100 text-gray-900 flex items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Job</h2>
        <p className="bg-red-100 p-4 rounded-md text-red-800">{error}</p>
        <button onClick={() => setSelectedJobId(null)} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
          Back to Jobs
        </button>
      </div>
    );
  }

  // 6. Results Mode (a job is selected and data is loaded)
  if (jobData) {
    return (
      <div className="min-h-screen bg-stone-100 text-gray-900 p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Analysis Results</h1>
            <button onClick={() => setSelectedJobId(null)} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
              Back to Jobs
            </button>
          </div>
          <div className="space-y-4 mb-12">
            {jobData.method === AnalysisMethod.INDIRECT ? (
              <IndirectAnalysisView
                data={jobData}
                openChapters={openChapters}
                onToggle={handleToggleChapter}
              />
            ) : (
              <DirectAnalysisView
                data={jobData}
                openChapters={openChapters}
                onToggle={handleToggleChapter}
              />
            )}
          </div>

          {/* Master Prompt Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Master Prompt
            </h2>
            <textarea
              readOnly
              value={masterPrompt}
              className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg shadow-inner resize-none"
            />
            <button
              onClick={handleCopyPrompt}
              className="mt-4 w-full flex items-center justify-center py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isCopied ? <FaCheck /> : <FaCopy />}
              <span className="ml-2">{isCopied ? 'Copied!' : 'Copy Prompt'}</span>
            </button>
            <textarea
              value={userDirection}
              onChange={(e) => setUserDirection(e.target.value)}
              placeholder="[Your task: continue the story...]"
              className="mt-4 w-full h-24 p-4 font-mono text-sm bg-white border border-gray-300 rounded-lg shadow-inner"
            />
          </div>
        </div>
      </div>
    );
  }

  // 5. Fallback
  return (
    <div className="min-h-screen bg-stone-100 text-gray-900 flex items-center justify-center">
      <p>No analysis data available.</p>
    </div>
  );
}

/**
 * Default export: Wraps the page in Suspense
 * This is required for useSearchParams() to work.
 */
export default function AnalysisPage() {
  return (
    <Suspense fallback={<FullPageLoader message="Initializing..." />}>
      <AnalysisPageContent />
    </Suspense>
  );
}