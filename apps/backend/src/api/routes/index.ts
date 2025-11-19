import { Router } from "express";
import {
  deleteAnalysisByJobId,
  getAnalysisJobData,
  getAnalysisJobsByStoryId,
  startAnalysisJobs,
} from "../controllers/analyzeController.js";
import {
  createStory,
  deleteStory,
  getStories,
  updateStory,
} from "../controllers/storyController.js";

const router: Router = Router();

// A 'ping' is for checking health, so it should be a GET
router.get("/ping", (_, res) => res.send("pong"));

// Starting an analysis is an action that "creates" a job,
// so it should use POST.
router.post("/analyze", startAnalysisJobs);

// Getting a job's data is retrieving data, so it
// should use GET.
router.get("/analyze/data/:jobId", getAnalysisJobData);
router.get("/stories/:storyId/jobs", getAnalysisJobsByStoryId);
router.delete("/analyze/:jobId", deleteAnalysisByJobId);

// Story routes
router.get("/stories", getStories);
router.post("/stories", createStory);
router.patch("/stories/:storyId", updateStory);
router.delete("/stories/:storyId", deleteStory);

export default router;
