import { InputType } from '@/types/story';
import { AnalysisRequest } from '@story-generation/types';

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/api';

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
}

/**
 * Calls the backend to start an analysis job.
 * @param inputType The type of analysis ('text', 'link', 'file')
 * @param payload The data required to start the job
 * @returns {Promise<{ jobId: string }>} The ID of the started job
 */
export const startAnalysisJob = async (
  inputType: InputType,
  payload: AnalysisRequest
): Promise<{ jobId: string }> => {
  let endpoint = '';
  let options: RequestInit = {};

  if (inputType === 'text') {
    endpoint = `${BASE_URL}/analyze`;
    options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };
  // } else if (inputType === 'link') {
  //   endpoint = `${BASE_URL}/analyze/link`;
  //   options = {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(payload),
  //   };
  // } else if (inputType === 'file') {
  //   endpoint = `${BASE_URL}/analyze/file`;
  //   // For files, the payload should be FormData
  //   options = {
  //     method: 'POST',
  //     body: payload, // Assuming payload is already FormData
  //   };
  } else {
    throw new Error('Invalid input type');
  }

  const response = await fetch(endpoint, options);

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(
      errData.error || `Error ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * Fetches the status of a specific analysis job.
 * @param jobId The ID of the job to check
 * @returns {Promise<JobStatus>} The current status of the job
 */
export interface JobStatus {
  status: 'Pending' | 'InProgress' | 'Complete' | 'Failed';
  message: string;
  error?: string;
}

export const fetchJobStatus = async (jobId: string): Promise<JobStatus> => {
  const response = await fetch(`${BASE_URL}/analyze/status/${jobId}`);
  
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(
      errData.error || `Error ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};