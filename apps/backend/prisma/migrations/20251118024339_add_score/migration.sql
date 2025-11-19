/*
  Warnings:

  - You are about to drop the column `analysisResults` on the `ChapterAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `ChapterAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `scoreRationale` on the `ChapterAnalysis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChapterAnalysis" DROP COLUMN "analysisResults",
DROP COLUMN "score",
DROP COLUMN "scoreRationale",
ADD COLUMN     "analysis" JSONB;

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" INTEGER NOT NULL,
    "rationale" TEXT NOT NULL,
    "chapterAnalysisId" TEXT NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Score_chapterAnalysisId_key" ON "Score"("chapterAnalysisId");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_chapterAnalysisId_fkey" FOREIGN KEY ("chapterAnalysisId") REFERENCES "ChapterAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
