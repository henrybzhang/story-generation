import "dotenv/config";

import {
  AnalysisMethod,
  type MasterStoryDocument,
} from "@story-generation/types";
import { Worker } from "bullmq";
import { prisma } from "./lib/prisma.js";
import { redisConnection } from "./lib/redisConnection.js";
import { analyzeChapterIndirectly } from "./services/analysisService.js";
import { log } from "./utils/logging.js";

interface JobData {
  jobId: string;
}

const worker = new Worker<JobData>(
  "story-analysis",
  async (job) => {
    const { jobId } = job.data;
    log(jobId, "Starting...");

    try {
      // 1. Get the job data
      const jobData = await prisma.analysisJob.findUnique({
        where: { id: jobId },
        include: {
          storyData: {
            include: {
              chapters: true,
            },
          },
        },
      });

      // Runtime check for data
      // This check now ensures we have storyData AND its chapters
      if (!jobData || !jobData.storyData || !jobData.storyData.chapters) {
        throw new Error(`Invalid job data or missing chapters for ${jobId}`);
      }

      await prisma.analysisJob.update({
        where: { id: jobId },
        data: { status: "IN_PROGRESS" },
      });

      let masterStoryDocument: MasterStoryDocument;
      if (jobData.method === AnalysisMethod.INDIRECT) {
        log(jobId, "Starting Indirect track...");
        masterStoryDocument = await analyzeChapterIndirectly(jobData);
        log(jobId, "Finished INDIRECT track.");
      } else {
        throw new Error(`Unsupported analysis method: ${jobData.method}`);
      }

      // 4. Mark as COMPLETED
      await prisma.analysisJob.update({
        where: { id: jobId },
        data: { status: "COMPLETED", masterDocument: masterStoryDocument },
      });

      log(jobId, "Successfully completed.");
    } catch (error) {
      log(jobId, `FAILED: ${error}`);
      // 5. Mark as FAILED (this logic is correct)
      if (jobId) {
        await prisma.analysisJob.update({
          where: { id: jobId },
          data: { status: "FAILED" },
        });
      }
    }
  },
  {
    connection: redisConnection,
  },
);

console.log("Story analysis worker listening for jobs...");
