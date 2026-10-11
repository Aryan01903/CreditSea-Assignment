import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";
import { ApiError } from "../utils/apiError";

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: "Route not found" });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ success: false, message: err.message, details: err.details });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      details: err.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
    });
    return;
  }

  if (err instanceof MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE" ? "File must be 5 MB or smaller" : err.message;
    res.status(400).json({ success: false, message });
    return;
  }

  console.error(err);
  res.status(500).json({ success: false, message: "Something went wrong" });
};
