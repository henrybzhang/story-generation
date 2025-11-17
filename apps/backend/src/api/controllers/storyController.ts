import type { UserStoryData } from "@story-generation/types";
import type { Request, Response } from "express";
import type { Prisma } from "@/generated/prisma/client.js";
import { prisma } from "@/src/lib/prisma.js";
import { AppError } from "@/src/middleware/AppError.js";

/**
 * GET /stories
 * Fetches all stories with their chapters
 */
export const getStories = async (_: Request, res: Response) => {
  try {
    const stories = await prisma.storyData.findMany({
      include: {
        chapters: true, // Include the chapters for each story
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.json(stories);
  } catch (error) {
    const cause = error instanceof Error ? error : undefined;
    throw new AppError("Failed to fetch stories", 500, {}, cause);
  }
};

/**
 * POST /stories
 * Creates a new story and its chapters
 */
export const createStory = async (req: Request, res: Response) => {
  const { name, chapters } = req.body as UserStoryData;

  if (!name || !chapters || chapters.length === 0) {
    throw new AppError("Name and chapters are required", 400);
  }

  try {
    // Use a nested 'create' to create the story and its chapters
    // in one transaction.
    const newStory = await prisma.storyData.create({
      data: {
        name: name,
        chapters: {
          create: chapters.map((chapter) => ({
            content: chapter.content,
            number: chapter.number,
            title: chapter.title,
          })),
        },
      },
      include: {
        chapters: true, // Return the new story with its chapters
      },
    });
    res.status(201).json(newStory);
  } catch (error) {
    const cause = error instanceof Error ? error : undefined;
    throw new AppError("Failed to create story", 500, {}, cause);
  }
};

/**
 * PATCH /stories/:storyId
 * Updates a story's name and/or chapters.
 */
export const updateStory = async (req: Request, res: Response) => {
  const { storyId } = req.params;
  const { name, chapters } = req.body as Partial<UserStoryData>;

  if (!storyId) {
    throw new AppError("Story ID is required", 400);
  }

  if (!name && chapters === undefined) {
    throw new AppError(
      "At least 'name' or 'chapters' must be provided for update",
      400,
    );
  }

  try {
    const dataToUpdate: Prisma.StoryDataUpdateInput = {};

    if (name) {
      dataToUpdate.name = name;
    }

    if (chapters !== undefined) {
      dataToUpdate.chapters = {
        deleteMany: {}, // Delete all existing chapters
        create: chapters.map((chapter) => ({
          // Create the new ones
          content: chapter.content,
          number: chapter.number,
          title: chapter.title,
        })),
      };
    }

    const updatedStory = await prisma.storyData.update({
      where: { id: storyId },
      data: dataToUpdate,
      include: {
        chapters: true,
      },
    });
    res.json(updatedStory);
  } catch (error) {
    const cause = error instanceof Error ? error : undefined;
    throw new AppError("Failed to update story", 500, {}, cause);
  }
};

/**
 * DELETE /stories/:storyId
 * Deletes a story and (thanks to our schema) all its
 * related chapters and analysis jobs.
 */
export const deleteStory = async (req: Request, res: Response) => {
  const { storyId } = req.params;

  if (!storyId) {
    throw new AppError("Story ID is required", 400);
  }

  try {
    await prisma.storyData.delete({
      where: { id: storyId },
    });
    res.status(204).send(); // 204 No Content is standard for a successful delete
  } catch (error) {
    const cause = error instanceof Error ? error : undefined;
    throw new AppError("Failed to delete story", 500, {}, cause);
  }
};
