/*
  Warnings:

  - You are about to drop the column `analysisJobId` on the `StoryAnalysis` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StoryAnalysis" DROP CONSTRAINT "StoryAnalysis_analysisJobId_fkey";

-- DropIndex
DROP INDEX "StoryAnalysis_analysisJobId_key";

-- AlterTable
ALTER TABLE "AnalysisJob" ADD COLUMN     "masterDocument" JSONB,
ADD COLUMN     "masterDocumentVersion" TEXT NOT NULL DEFAULT 'v1.0.0',
ADD COLUMN     "modelName" TEXT NOT NULL DEFAULT 'x-ai/grok-4-fast';

-- AlterTable
ALTER TABLE "StoryAnalysis" DROP COLUMN "analysisJobId",
ADD COLUMN     "modelName" TEXT NOT NULL DEFAULT 'x-ai/grok-4-fast',
ADD COLUMN     "promptVersion" TEXT NOT NULL DEFAULT 'v1.0.0';
