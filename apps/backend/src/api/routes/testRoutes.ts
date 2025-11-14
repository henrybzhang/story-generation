import { Router } from "express";
import { ping } from "../controllers/testController.js";

const router: Router = Router();

router.get("/ping", ping);

export default router;
