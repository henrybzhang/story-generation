import cors from "cors";
import type { Express } from "express";
import express from "express";
import apiRoutes from "./src/api/routes/index.js";
import { errorHandler } from "./src/middleware/errorHandler.js"; // Adjust path if needed

const app: Express = express();

const corsOptions = {
  origin: "http://localhost:3001",
};

app.use(cors(corsOptions));

// Increase the payload size limit here
const limit = "50mb";

app.use(express.json({ limit: limit }));
app.use(express.urlencoded({ limit: limit, extended: true }));

// Mount the main API router
app.use("/api", apiRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
