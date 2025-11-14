import { Router } from "express";
import analyzeRoutes from "./analyzeRoutes.js";
import testRoutes from "./testRoutes.js";

const router: Router = Router();

router.use("/test", testRoutes);
router.use("/analyze", analyzeRoutes);

export default router;
