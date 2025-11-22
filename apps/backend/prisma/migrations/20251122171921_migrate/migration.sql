/*
  Warnings:

  - You are about to drop the column `chapterNumber` on the `AnalysisJob` table. All the data in the column will be lost.
  - Added the required column `lastChapterNumber` to the `AnalysisJob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnalysisJob" DROP COLUMN "chapterNumber",
ADD COLUMN     "lastChapterNumber" INTEGER NOT NULL;
