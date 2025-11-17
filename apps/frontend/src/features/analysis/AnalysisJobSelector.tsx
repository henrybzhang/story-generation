// src/features/analysis/components/AnalysisJobSelector.tsx
'use client';

import { AnalysisJobSimpleData } from '@story-generation/types';
import Link from 'next/link';
import { FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface AnalysisJobSelectorProps {
  jobs: AnalysisJobSimpleData[];
  onJobSelect: (jobId: string) => void;
  selectedJobId: string | null;
}

// Helper to format date (you can use a library like date-fns)
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function AnalysisJobSelector({ jobs, onJobSelect, selectedJobId }: AnalysisJobSelectorProps) {
  const sortedJobs = [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (jobs.length === 0) {
    return (
      <div className="min-h-screen bg-stone-100 text-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            No Analyses Found
          </h1>
          <p className="text-gray-600 mb-8">
            There are no analysis jobs for this story yet.
          </p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-gray-900 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
          Select Analysis
        </h1>
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {sortedJobs.map((job) => (
              <li key={job.id}>
                <JobListItem
                  job={job}
                  onSelect={onJobSelect}
                  isSelected={selectedJobId === job.id}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function JobListItem({ job, onSelect, isSelected }: {
  job: AnalysisJobSimpleData;
  onSelect: (jobId: string) => void;
  isSelected: boolean;
}) {
  const isCompleted = job.status === 'COMPLETED';
  const isPending = job.status === 'PENDING';
  const isInProgress = job.status === 'IN_PROGRESS';
  const isFailed = job.status === 'FAILED';

  const commonClasses = "flex items-center justify-between p-6 w-full text-left transition-colors";
  const selectedClasses = isSelected ? 'bg-blue-50' : 'hover:bg-gray-50';

  const content = (
    <div className="flex-grow flex items-center justify-between">
      <div className="flex-shrink-0 mr-4">
        {isCompleted && <FaCheckCircle className="h-6 w-6 text-green-500" />}
        {isPending && <FaClock className="h-6 w-6 text-yellow-500" />}
        {isInProgress && <FaClock className="h-6 w-6 text-blue-500 animate-spin" />}
        {isFailed && <FaExclamationCircle className="h-6 w-6 text-red-500" />}
      </div>
      <div className="flex-grow">
        <p className="text-lg font-medium text-gray-900 capitalize">
          {job.method} Analysis
        </p>
        <p className="text-sm text-gray-500">
          Created: {formatDate(job.createdAt)}
        </p>
      </div>
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${
          isCompleted ? 'bg-green-100 text-green-800' :
          isPending ? 'bg-yellow-100 text-yellow-800' :
          isInProgress ? 'bg-blue-100 text-blue-800' :
          'bg-red-100 text-red-800'
        }`}
      >
        {job.status}
      </span>
    </div>
  );

  if (isCompleted) {
    return (
      <button onClick={() => onSelect(job.id)} className={`${commonClasses} ${selectedClasses}`}>
        {content}
      </button>
    );
  }

  return (
    <div className={`${commonClasses} opacity-60 cursor-not-allowed`}>
      {content}
    </div>
  );
}