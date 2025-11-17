import type {
  AnalysisMethod,
  MasterStoryDocument,
} from "@story-generation/types";
import type { ChapterData } from "@/generated/prisma/client.js";

export type ContextualChapterAnalysisRequest = {
  chapterData: ChapterData;
  masterStoryDocument?: MasterStoryDocument;
  method: AnalysisMethod;
};
