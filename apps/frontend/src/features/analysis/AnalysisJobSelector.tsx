// src/features/analysis/components/AnalysisJobSelector.tsx
'use client';

import { AnalysisJobSimpleData } from '@story-generation/types';
import Link from 'next/link';
import { FaClock, FaCheckCircle, FaExclamationCircle, FaTrash } from 'react-icons/fa';
import { useState } from 'react';

interface AnalysisJobSelectorProps {
  jobs: AnalysisJobSimpleData[];
  onJobSelect: (jobId: string) => void;
  selectedJobId: string | null;
  onDeleteJobs?: (jobIds: string[]) => Promise<void>;
}

// Helper to format date (you can use a library like date-fns)
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function AnalysisJobSelector({ jobs, onJobSelect, selectedJobId, onDeleteJobs }: AnalysisJobSelectorProps) {
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const sortedJobs = [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleToggleJob = (jobId: string) => {
    setSelectedJobIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const handleToggleAll = () => {
    if (selectedJobIds.size === sortedJobs.length) {
      setSelectedJobIds(new Set());
    } else {
      setSelectedJobIds(new Set(sortedJobs.map(job => job.id)));
    }
  };

  const handleDelete = async () => {
    if (!onDeleteJobs || selectedJobIds.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedJobIds.size} analysis job(s)?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDeleteJobs(Array.from(selectedJobIds));
      setSelectedJobIds(new Set());
    } catch (error) {
      console.error('Failed to delete jobs:', error);
      alert('Failed to delete some jobs. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
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

  const allSelected = sortedJobs.length > 0 && selectedJobIds.size === sortedJobs.length;

  return (
    <div className="min-h-screen bg-stone-100 text-gray-900 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Select Analysis</h1>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
        
        {onDeleteJobs && sortedJobs.length > 0 && (
          <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleAll}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-700">Select All</span>
              </label>
              {selectedJobIds.size > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedJobIds.size} selected
                </span>
              )}
            </div>
            <button
              onClick={handleDelete}
              disabled={selectedJobIds.size === 0 || isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaTrash />
              {isDeleting ? 'Deleting...' : `Delete (${selectedJobIds.size})`}
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {sortedJobs.map((job) => (
              <li key={job.id}>
                <JobListItem
                  job={job}
                  onSelect={onJobSelect}
                  isSelected={selectedJobId === job.id}
                  isChecked={selectedJobIds.has(job.id)}
                  onToggleCheck={onDeleteJobs ? handleToggleJob : undefined}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function JobListItem({ job, onSelect, isSelected, isChecked, onToggleCheck }: {
  job: AnalysisJobSimpleData;
  onSelect: (jobId: string) => void;
  isSelected: boolean;
  isChecked?: boolean;
  onToggleCheck?: (jobId: string) => void;
}) {
  const isCompleted = job.status === 'COMPLETED';
  const isPending = job.status === 'PENDING';
  const isInProgress = job.status === 'IN_PROGRESS';
  const isFailed = job.status === 'FAILED';

  const commonClasses = "flex items-center justify-between p-6 w-full text-left transition-colors";
  const selectedClasses = isSelected ? 'bg-blue-50' : 'hover:bg-gray-50';

  const content = (
    <div className="flex-grow flex items-center justify-between">
      {onToggleCheck && (
        <div className="flex-shrink-0 mr-4">
          <input
            type="checkbox"
            checked={isChecked || false}
            onChange={(e) => {
              e.stopPropagation();
              onToggleCheck(job.id);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      )}
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