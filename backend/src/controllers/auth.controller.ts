import { type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../middlewares/error-handler.middleware";
import { loginUser, registerUser } from "../services/auth.service";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const formatZodError = (error: ZodError): string => {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "payload";
      return `${path}: ${issue.message}`;
    })
    .join(" | ");
};

const handleControllerError = (error: unknown, next: NextFunction): void => {
  if (error instanceof ZodError) {
    next(new AppError(formatZodError(error), 400));
    return;
  }

  next(error);
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = registerSchema.parse(req.body);
    const user = await registerUser(payload);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    handleControllerError(error, next);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = loginSchema.parse(req.body);
    const token = await loginUser(payload);

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    handleControllerError(error, next);
  }
};
