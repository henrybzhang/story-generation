export const log = (jobId: string, message: string) =>
  console.log(`[${new Date().toISOString()}] [JOB ${jobId}] ${message}`);
