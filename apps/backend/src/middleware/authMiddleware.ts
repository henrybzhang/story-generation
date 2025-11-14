import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./AppError.js";

interface JwtPayload {
  id: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authentication invalid: No token provided", 401);
  }

  const token = authHeader.split(" ")[1] as string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded.id) {
      throw new AppError(
        "Authentication invalid: Token is missing user ID",
        401,
        { token, decoded },
      );
    }

    req.user = { id: decoded.id };

    next();
  } catch (err) {
    throw new AppError("Authentication invalid: Invalid token", 401);
  }
};
