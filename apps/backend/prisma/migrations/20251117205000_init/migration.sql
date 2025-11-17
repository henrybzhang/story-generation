-- CreateEnum
CREATE TYPE "AnalysisJobStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "AnalysisJob" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "AnalysisJobStatus" NOT NULL DEFAULT 'PENDING',
    "method" TEXT NOT NULL,
    "storyDataId" TEXT NOT NULL,

    CONSTRAINT "AnalysisJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryAnalysis" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "analysisJobId" TEXT NOT NULL,

    CONSTRAINT "StoryAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterAnalysis" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chapterDataId" TEXT NOT NULL,
    "analysisResults" JSONB,
    "score" INTEGER NOT NULL,
    "scoreRationale" TEXT NOT NULL,
    "storyAnalysisId" TEXT NOT NULL,

    CONSTRAINT "ChapterAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterData" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "storyDataId" TEXT NOT NULL,

    CONSTRAINT "ChapterData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoryAnalysis_analysisJobId_key" ON "StoryAnalysis"("analysisJobId");

-- AddForeignKey
ALTER TABLE "AnalysisJob" ADD CONSTRAINT "AnalysisJob_storyDataId_fkey" FOREIGN KEY ("storyDataId") REFERENCES "StoryData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAnalysis" ADD CONSTRAINT "StoryAnalysis_analysisJobId_fkey" FOREIGN KEY ("analysisJobId") REFERENCES "AnalysisJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterAnalysis" ADD CONSTRAINT "ChapterAnalysis_chapterDataId_fkey" FOREIGN KEY ("chapterDataId") REFERENCES "ChapterData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterAnalysis" ADD CONSTRAINT "ChapterAnalysis_storyAnalysisId_fkey" FOREIGN KEY ("storyAnalysisId") REFERENCES "StoryAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterData" ADD CONSTRAINT "ChapterData_storyDataId_fkey" FOREIGN KEY ("storyDataId") REFERENCES "StoryData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
