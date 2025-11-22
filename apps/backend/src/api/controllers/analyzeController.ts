import { AnalysisMethod, type AnalysisRequest } from "@story-generation/types";
import type { Request, Response } from "express";
import { prisma } from "@/src/lib/prisma.js";
import { AppError } from "@/src/middleware/AppError.js";
import { processAnalysisJob } from "@/src/services/analysisService.js";

export const startAnalysisJobs = async (req: Request, res: Response) => {
  const { storyId, lastChapterNumber } = req.body as AnalysisRequest;
  try {
    const jobs = await Promise.allSettled([
      processAnalysisJob(storyId, AnalysisMethod.INDIRECT, lastChapterNumber),
      // processAnalysisJob(storyId, AnalysisMethod.DIRECT),
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
    throw new AppError("No job ID provided", 400);
  }

  try {
    const analysisJob = await prisma.analysisJob.findUnique({
      where: { id: jobId },
      include: {
        storyData: {
          include: {
            chapters: {
              include: {
                chapterAnalysis: {
                  include: {
                    storyAnalysis: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!analysisJob) {
      throw new AppError("Job not found", 404, { jobId });
    }

    const allChapterAnalyses = analysisJob.storyData.chapters.flatMap(
      (c) => c.chapterAnalysis,
    );

    if (allChapterAnalyses.length === 0) {
      const { storyData, ...analysisJobFields } = analysisJob;
      return res
        .status(200)
        .json({ ...analysisJobFields, chapterAnalyses: [] });
    }

    const latestStoryAnalysis = allChapterAnalyses.reduce((latest, current) => {
      if (
        !latest ||
        current.storyAnalysis.promptVersion > latest.storyAnalysis.promptVersion
      ) {
        return current;
      }
      return latest;
    }).storyAnalysis;

    const chapterAnalyses = allChapterAnalyses
      .filter((a) => a.storyAnalysisId === latestStoryAnalysis.id)
      .map((analysis) => {
        const chapter = analysisJob.storyData.chapters.find(
          (c) => c.id === analysis.chapterDataId,
        );
        return {
          chapterNumber: chapter?.number,
          analysis: analysis.analysis,
        };
      });

    const { storyData, ...analysisJobFields } = analysisJob;

    res.status(200).json({ ...analysisJobFields, chapterAnalyses });
  } catch (error) {
    const cause = error instanceof Error ? error : new Error(String(error));
    if (error instanceof AppError) {
      throw error;
    }
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
