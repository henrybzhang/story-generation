import "dotenv/config";

import type { MasterStoryDocument } from "@story-generation/types";
import { Worker } from "bullmq";
import type { ChapterData } from "@/generated/prisma/client.js";
import { prisma } from "./lib/prisma.js";
import { redisConnection } from "./lib/redisConnection.js";
import {
  analyzeChapterIndividually,
  analyzeChapterWithContext,
} from "./services/analysisService.js";

const runIndividualAnalysis = async (
  chapters: ChapterData[],
  storyAnalysisId: string,
  jobId: string,
) => {
  console.log(`[JOB ${jobId}] Starting INDIVIDUAL track (parallel)...`);
  const individualPromises = chapters.map((chapter) =>
    analyzeChapterIndividually(chapter).then((result) =>
      prisma.chapterAnalysis.create({
        data: {
          analysisResults: result.analysis,
          score: result.score.score,
          scoreRationale: result.score.rationale,
          chapterData: { connect: { id: chapter.id } },
          storyAnalysis: { connect: { id: storyAnalysisId } },
        },
      }),
    ),
  );
  await Promise.all(individualPromises);
  console.log(`[JOB ${jobId}] Finished INDIVIDUAL track.`);
};

// --- 3. Track B: Run all Contextual Analyses Sequentially ---
const runContextualAnalysis = async (
  chapters: ChapterData[],
  storyAnalysisId: string,
  jobId: string,
) => {
  console.log(`[JOB ${jobId}] Starting CONTEXTUAL track (sequential)...`);
  let currentMasterDoc: MasterStoryDocument | undefined;

  for (const chapter of chapters) {
    const result = await analyzeChapterWithContext(chapter, currentMasterDoc);

    await prisma.chapterAnalysis.create({
      data: {
        analysisResults: result.masterStoryDocument, // Store the output doc
        score: result.score.score,
        scoreRationale: result.score.rationale,
        chapterData: { connect: { id: chapter.id } },
        storyAnalysis: { connect: { id: storyAnalysisId } },
      },
    });

    // Pass the new master doc to the next iteration
    currentMasterDoc = result.masterStoryDocument;
    console.log(
      `[JOB ${jobId}] CONTEXTUAL analysis for chapter ${chapter.number} complete.`,
    );
  }
  console.log(`[JOB ${jobId}] Finished CONTEXTUAL track.`);
};

// --- 4. The Main Worker ---
// --- 4. The Main Worker ---
const worker = new Worker(
  "story-analysis",
  async (job) => {
    const { jobId } = job.data;
    console.log(`[JOB ${jobId}] Starting...`);

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
      // ... (rest of your logic) ...

      // --- Find or Create StoryAnalysis Logic ---
      let storyAnalysisId: string;

      if (jobData.storyAnalysis) {
        storyAnalysisId = jobData.storyAnalysis.id;
        console.log(
          `[JOB ${jobId}] Found existing StoryAnalysis: ${storyAnalysisId}. Clearing old results...`,
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
        console.log(
          `[JOB ${jobId}] Created new StoryAnalysis: ${storyAnalysisId}`,
        );
      }

      // This line will now work correctly
      const { chapters } = jobData.storyData;

      // 3. Run the analysis based on the job method
      if (jobData.method === "INDIVIDUAL") {
        await runIndividualAnalysis(chapters, storyAnalysisId, jobId);
      } else if (jobData.method === "CONTEXTUAL") {
        await runContextualAnalysis(chapters, storyAnalysisId, jobId);
      } else {
        throw new Error(`Invalid analysis method: ${jobData.method}`);
      }

      // ... (rest of your worker logic: mark as COMPLETED or FAILED) ...

      // 4. Mark as COMPLETED
      await prisma.analysisJob.update({
        where: { id: jobId },
        data: { status: "COMPLETED" },
      });

      console.log(`[JOB ${jobId}] Successfully completed.`);
    } catch (error) {
      console.error(`[JOB ${jobId}] FAILED:`, error);
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
