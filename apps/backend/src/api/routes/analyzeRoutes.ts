import { Router } from "express";
import {
  analyzeFiles,
  analyzeLink,
  analyzeText,
} from "../controllers/analyzeController.js";

const router: Router = Router();

router.post("/text", analyzeText);
router.post("/files", analyzeFiles);
router.post("/link", analyzeLink);

export default router;
