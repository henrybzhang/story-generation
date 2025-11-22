/*
  Warnings:

  - You are about to drop the column `masterDocumentVersion` on the `AnalysisJob` table. All the data in the column will be lost.
  - Added the required column `chapterNumber` to the `AnalysisJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promptVersion` to the `AnalysisJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storyDataId` to the `StoryAnalysis` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `promptVersion` on the `StoryAnalysis` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
DELETE FROM "AnalysisJob";
DELETE FROM "StoryAnalysis";
DELETE FROM "ChapterAnalysis";

-- AlterTable
ALTER TABLE "AnalysisJob" DROP COLUMN "masterDocumentVersion",
ADD COLUMN     "chapterNumber" INTEGER NOT NULL,
ADD COLUMN     "promptVersion" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StoryAnalysis" ADD COLUMN     "storyDataId" TEXT NOT NULL,
DROP COLUMN "promptVersion",
ADD COLUMN     "promptVersion" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "StoryAnalysis" ADD CONSTRAINT "StoryAnalysis_storyDataId_fkey" FOREIGN KEY ("storyDataId") REFERENCES "StoryData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
