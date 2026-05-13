import { type NextFunction, type Request, type Response } from "express";
import { getHealthStatus } from "../services/health.service";

export const getHealth = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const health = await getHealthStatus();
    res.status(200).json(health);
  } catch (error) {
    next(error);
  }
};
