import cors from "cors";
import type { Express } from "express";
import express from "express";
import apiRoutes from "./src/api/routes/index.js";
import { AppError } from "./src/middleware/AppError.js";
import { errorHandler } from "./src/middleware/errorHandler.js"; // Adjust path if needed

const app: Express = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
};

app.use(cors(corsOptions));

// Increase the payload size limit here
const limit = "50mb";

app.use(express.json({ limit: limit }));
app.use(express.urlencoded({ limit: limit, extended: true }));

// Mount the main API router
app.use("/api", apiRoutes);

// --- 2. ADD THIS 404 HANDLER ---
// This catches all requests that didn't match any of the routes above
app.use((req, _, next) => {
  // Create a new 404 AppError
  const err = new AppError(`Resource not found at ${req.originalUrl}`, 404);

  // Pass it to the global error handler
  next(err);
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
