import { type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../middlewares/error-handler.middleware";
import {
  createProduct as createProductService,
  deleteProduct as deleteProductService,
  getProductById as getProductByIdService,
  getProducts as getProductsService,
  updateProduct as updateProductService,
} from "../services/product.service";
import {
  createProductSchema,
  getProductsQuerySchema,
  productIdParamSchema,
  updateProductSchema,
} from "../validators/product.validator";

const applyUploadedImagePath = (req: Request): void => {
  if (!req.file) {
    return;
  }

  req.body.imageUrl = `/uploads/products/${req.file.filename}`;
};

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

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    applyUploadedImagePath(req);
    const payload = createProductSchema.parse(req.body);
    const product = await createProductService(payload);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    handleControllerError(error, next);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = getProductsQuerySchema.parse(req.query);
    const result = await getProductsService(query);

    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    handleControllerError(error, next);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = productIdParamSchema.parse(req.params);
    const product = await getProductByIdService(id);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    handleControllerError(error, next);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = productIdParamSchema.parse(req.params);
    applyUploadedImagePath(req);
    const payload = updateProductSchema.parse(req.body);
    const product = await updateProductService(id, payload);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    handleControllerError(error, next);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = productIdParamSchema.parse(req.params);
    const product = await deleteProductService(id);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    handleControllerError(error, next);
  }
};
