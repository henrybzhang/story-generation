"use client";

import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/lib/api';
import { AnalysisJobData, AnalysisJobSimpleData } from '@story-generation/types';

const fetchJobData = async (jobId: string): Promise<AnalysisJobData> => {
  const res = await fetch(`${BASE_URL}/analyze/data/${jobId}`);
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to fetch job status');
  }
  return res.json();
};

const fetchJobList = async (storyId: string): Promise<AnalysisJobSimpleData[]> => {
  const res = await fetch(`${BASE_URL}/stories/${storyId}/jobs`);
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to fetch job list');
  }
  return res.json();
};

/**
 * Hook to manage fetching analysis data using TanStack Query.
 * @param storyId - The ID of the story
 * @param selectedJobId - The selected job ID
 */
export const useAnalysisData = (storyId: string, selectedJobId: string | null) => {

  // --- HOOK 1: JOB LIST (Selection Mode) ---
  const listQuery = useQuery({
    queryKey: ['jobs', storyId], // Query key includes storyId
    queryFn: () => fetchJobList(storyId),
    refetchInterval: (query) => {
      const data = query.state.data as AnalysisJobSimpleData[] | undefined;
      const hasPendingJobs = data?.some(
        (job) => job.status === 'PENDING' || job.status === 'IN_PROGRESS'
      );
      // If there are pending jobs, poll every 5 seconds. Otherwise, stop.
      return hasPendingJobs ? 5000 : false;
    },
  });

  // --- HOOK 2: POLLING (Results Mode) ---
  const jobQuery = useQuery({
    queryKey: ['job', selectedJobId], // Query key includes jobId
    queryFn: () => fetchJobData(selectedJobId!), // The `!` is safe due to `enabled`
    enabled: !!selectedJobId, // ★ Only runs if jobId is PRESENT
    
    // ★ Built-in polling logic
    refetchInterval: (query) => {
      const data = query.state.data;
      // Stop polling if complete or failed
      if (data?.status === 'COMPLETED' || data?.status === 'FAILED') {
        return false; // Stops the interval
      }
      return 300000; // Poll every 30 seconds
    },
    // Don't refetch on window focus when polling
    refetchOnWindowFocus: false, 
  });

  // --- DERIVE FINAL STATE ---
  // We derive all state directly from the two queries.
  // No useState or useEffect needed.

  const jobData = jobQuery.data;
  const isFinalStatus =
    jobData?.status === 'COMPLETED' || jobData?.status === 'FAILED';

  // "Loading" means the initial fetch (not subsequent polling fetches)
  const isLoading = listQuery.isLoading || (!!selectedJobId && jobQuery.isLoading);

  // "Polling" means it's currently refetching, but not yet done
  const isPolling = jobQuery.isFetching && !isFinalStatus;

  // The final analysis data only exists when the job is complete
  const storyAnalysisData =
    jobData?.status === 'COMPLETED' ? jobData : null;

  // Combine errors from either query
  const error = listQuery.error?.message || jobQuery.error?.message || null;

  return {
    jobList: listQuery.data || null,

    storyAnalysisData,
    isPolling,
    pollingMessage: jobData?.status === 'COMPLETED' ? 'Analysis complete' : 'Analysis in progress',
    
    // Shared
    isLoading,
    error,
  };
};