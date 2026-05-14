import { type ErrorRequestHandler } from "express";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : "Internal Server Error";

  const response: {
    success: false;
    message: string;
    stack?: string;
  } = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === "development" && error instanceof Error) {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};
