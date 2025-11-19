import type { AnalysisRequest } from "@story-generation/types";
import type { Request, Response } from "express";
import { prisma } from "@/src/lib/prisma.js";
import { AppError } from "@/src/middleware/AppError.js";
import { processAnalysisJob } from "@/src/services/analysisService.js";

export const startAnalysisJobs = async (req: Request, res: Response) => {
  const { storyId } = req.body as AnalysisRequest;
  try {
    const jobs = await Promise.allSettled([
      processAnalysisJob(storyId, "contextual"),
      processAnalysisJob(storyId, "individual"),
    ]);

    // 3. Return 202 Accepted immediately
    res.status(202).json({
      message: "Analysis job accepted",
      jobs: jobs.map((job) =>
        job.status === "fulfilled" ? job.value : job.reason,
      ),
    });
  } catch (error) {
    const cause = error instanceof Error ? error : undefined;
    throw new AppError(
      "Failed to submit analysis jobs",
      500,
      { storyId },
      cause,
    );
  }
};

export const getAnalysisJobData = async (req: Request, res: Response) => {
  const { jobId } = req.params;

  if (!jobId) {
    // Or return null, or handle the error as appropriate for your app
    throw new AppError("No job ID provided", 400);
  }

  try {
    const job = await prisma.analysisJob.findUnique({
      where: {
        id: jobId,
      },
      select: {
        id: true,
        status: true,
        method: true,
        storyAnalysis: {
          select: {
            id: true,
            chapterAnalyses: {
              select: {
                id: true, // Good for error logging
                analysis: true,
                score: true,
                chapterData: {
                  select: {
                    number: true,
                  },
                },
              },
              orderBy: {
                // Optional: Good practice to ensure order
                chapterData: {
                  number: "asc",
                },
              },
            },
          },
        },
      },
    });

    if (!job) {
      throw new AppError("Job not found", 404, { jobId });
    }

    if (!job.storyAnalysis || !job.storyAnalysis.chapterAnalyses) {
      throw new AppError("Job is missing critical analysis data.", 500, {
        jobId,
      });
    }

    const transformedChapters = job.storyAnalysis.chapterAnalyses.map(
      (chapter) => {
        const { chapterData, ...rest } = chapter;

        return {
          ...rest,
          number: chapterData.number,
        };
      },
    );

    const reshapedJob = {
      ...job,
      storyAnalysis: {
        ...job.storyAnalysis,
        chapterAnalyses: transformedChapters,
      },
    };

    res.status(200).json(reshapedJob);
  } catch (error) {
    const cause = error instanceof Error ? error : new Error(String(error));
    // Re-throwing AppError is fine if you have middleware to catch it
    if (error instanceof AppError) {
      throw error;
    }
    // Otherwise, wrap it
    throw new AppError("Failed to fetch job data", 500, { jobId }, cause);
  }
};

export const getAnalysisJobsByStoryId = async (req: Request, res: Response) => {
  const { storyId } = req.params;
  if (!storyId) {
    // Or return null, or handle the error as appropriate for your app
    throw new AppError("No story ID provided", 400);
  }

  try {
    const jobs = await prisma.analysisJob.findMany({
      where: {
        storyDataId: storyId,
      },
    });

    if (!jobs) {
      return res.status(404).json({ error: "Jobs not found" });
    }

    res.status(200).json(jobs);
  } catch (error) {
    const cause = error instanceof Error ? error : undefined;
    throw new AppError(
      "Failed to fetch jobs by storyId",
      500,
      { storyId },
      cause,
    );
  }
};

/**
 * DELETE /analysis/:storyId
 * Deletes an AnalysisJob based on its related storyId.
 */
export const deleteAnalysisByStoryId = async (req: Request, res: Response) => {
  const { storyId } = req.params;

  if (!storyId) {
    throw new AppError("No story ID provided", 400);
  }

  try {
    // Use the unique 'storyDataId' field to find and delete
    // the correct analysis job.
    await prisma.analysisJob.deleteMany({
      where: {
        storyDataId: storyId,
      },
    });
    res.status(204).send(); // 204 No Content
  } catch (error) {
    const cause = error instanceof Error ? error : undefined;
    throw new AppError(
      "Failed to delete analysis with storyId",
      500,
      { storyId },
      cause,
    );
  }
};

/**
 * DELETE /analysis/:storyId
 * Deletes an AnalysisJob based on its related storyId.
 */
export const deleteAnalysisByJobId = async (req: Request, res: Response) => {
  const { jobId } = req.params;

  if (!jobId) {
    throw new AppError("No job ID provided", 400);
  }

  try {
    // Use the unique 'storyDataId' field to find and delete
    // the correct analysis job.
    await prisma.analysisJob.delete({
      where: {
        id: jobId,
      },
    });
    res.status(204).send(); // 204 No Content
  } catch (error) {
    const cause = error instanceof Error ? error : undefined;
    throw new AppError(
      "Failed to delete analysis with jobId",
      500,
      { jobId },
      cause,
    );
  }
};
