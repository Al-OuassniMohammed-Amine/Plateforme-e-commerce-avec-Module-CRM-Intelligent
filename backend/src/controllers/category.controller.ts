import { type NextFunction, type Request, type Response } from "express";
import { getCategories as getCategoriesService } from "../services/category.service";

export const getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await getCategoriesService();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
