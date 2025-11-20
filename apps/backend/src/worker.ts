import "dotenv/config";

import {
  AnalysisMethod,
  type MasterStoryDocument,
} from "@story-generation/types";
import { Worker } from "bullmq";
import type { ChapterData } from "@/generated/prisma/client.js";
import { prisma } from "./lib/prisma.js";
import { redisConnection } from "./lib/redisConnection.js";
import {
  analyzeChapterDirectly,
  analyzeChapterIndirectly,
} from "./services/analysisService.js";

const log = (jobId: string, message: string) =>
  console.log(`[${new Date().toISOString()}] [JOB ${jobId}] ${message}`);

const runIndirectAnalysis = async (
  chapters: ChapterData[],
  storyAnalysisId: string,
  jobId: string,
) => {
  log(jobId, "Starting Indirect track...");
  let currentMasterDoc: MasterStoryDocument | undefined;

  for (const chapter of chapters) {
    const result = await analyzeChapterIndirectly(chapter, currentMasterDoc);

    await prisma.chapterAnalysis.create({
      data: {
        analysis: result.analysis,
        chapterData: { connect: { id: chapter.id } },
        storyAnalysis: { connect: { id: storyAnalysisId } },
        score: {
          create: {
            value: result.score.value,
            rationale: result.score.rationale,
          },
        },
      },
    });

    // Pass the new master doc to the next iteration
    currentMasterDoc = result.analysis.masterStoryDocument;
    log(jobId, `INDIRECT analysis for chapter ${chapter.number} complete.`);
  }
  log(jobId, "Finished INDIRECT track.");
};

const runDirectAnalysis = async (
  chapters: ChapterData[],
  storyAnalysisId: string,
  jobId: string,
) => {
  log(jobId, "Starting Direct track...");
  let currentMasterDoc: MasterStoryDocument | undefined;

  for (const chapter of chapters) {
    const result = await analyzeChapterDirectly(chapter, currentMasterDoc);

    await prisma.chapterAnalysis.create({
      data: {
        analysis: result.analysis,
        chapterData: { connect: { id: chapter.id } },
        storyAnalysis: { connect: { id: storyAnalysisId } },
        score: {
          create: {
            value: result.score.value,
            rationale: result.score.rationale,
          },
        },
      },
    });

    // Pass the new master doc to the next iteration
    currentMasterDoc = result.analysis.masterStoryDocument;
    log(jobId, `DIRECT analysis for chapter ${chapter.number} complete.`);
  }
  log(jobId, "Finished DIRECT track.");
};

// --- 4. The Main Worker ---
const worker = new Worker<{ jobId: string }>(
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
          storyAnalysis: true,
        },
      });

      // Runtime check for data
      // This check now ensures we have storyData AND its chapters
      if (!jobData || !jobData.storyData || !jobData.storyData.chapters) {
        throw new Error(`Invalid job data or missing chapters for ${jobId}`);
      }

      // 2. Mark as RUNNING
      await prisma.analysisJob.update({
        where: { id: jobId },
        data: { status: "IN_PROGRESS" },
      });

      // --- Find or Create StoryAnalysis Logic ---
      let storyAnalysisId: string;

      if (jobData.storyAnalysis) {
        storyAnalysisId = jobData.storyAnalysis.id;
        log(
          jobId,
          `Found existing StoryAnalysis: ${storyAnalysisId}. Clearing old results...`,
        );
        await prisma.chapterAnalysis.deleteMany({
          where: { storyAnalysisId: storyAnalysisId },
        });
      } else {
        const newStoryAnalysis = await prisma.storyAnalysis.create({
          data: {
            analysisJob: { connect: { id: jobData.id } },
          },
        });
        storyAnalysisId = newStoryAnalysis.id;
        log(jobId, `Created new StoryAnalysis: ${storyAnalysisId}`);
      }

      // This line will now work correctly
      const { chapters } = jobData.storyData;

      // 3. Run the analysis based on the job method
      if (jobData.method === AnalysisMethod.DIRECT) {
        await runDirectAnalysis(chapters, storyAnalysisId, jobId);
      } else if (jobData.method === AnalysisMethod.INDIRECT) {
        await runIndirectAnalysis(chapters, storyAnalysisId, jobId);
      } else {
        throw new Error(`Invalid analysis method: ${jobData.method}`);
      }

      // 4. Mark as COMPLETED
      await prisma.analysisJob.update({
        where: { id: jobId },
        data: { status: "COMPLETED" },
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
    concurrency: 3,
  },
);

console.log("Story analysis worker listening for jobs...");
