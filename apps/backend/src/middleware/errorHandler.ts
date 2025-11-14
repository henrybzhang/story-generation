import type { NextFunction, Request, Response } from "express";
import logger from "@/lib/logger.js";
import { AppError } from "./AppError.js";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Entering error handler");

  // Default to a 500 server error if the error is not a known AppError
  const isAppError = err instanceof AppError;
  const status = isAppError ? err.status : 500;
  const message = isAppError ? err.message : "Internal server error";
  const params = isAppError ? err.params : {};

  const logObject = {
    err: err,
    requestContext: {
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      ip: req.ip,
    },
    status,
    params,
  };

  logger.error(logObject, message);

  res.status(status).json({
    message: message,
  });
};
