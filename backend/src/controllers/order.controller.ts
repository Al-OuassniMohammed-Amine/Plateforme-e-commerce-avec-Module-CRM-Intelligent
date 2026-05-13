import { type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../middlewares/error-handler.middleware";
import {
  createOrder as createOrderService,
  getOrderById as getOrderByIdService,
  getOrders as getOrdersService,
  updateOrderStatus as updateOrderStatusService,
} from "../services/order.service";
import {
  createOrderSchema,
  getOrdersQuerySchema,
  orderIdParamSchema,
  updateOrderStatusSchema,
} from "../validators/order.validator";

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

export const getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = getOrdersQuerySchema.parse(req.query);
    const result = await getOrdersService(query);

    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    handleControllerError(error, next);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = orderIdParamSchema.parse(req.params);
    const order = await getOrderByIdService(id);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    handleControllerError(error, next);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = orderIdParamSchema.parse(req.params);
    const payload = updateOrderStatusSchema.parse(req.body);
    const updatedOrder = await updateOrderStatusService(id, payload);

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    handleControllerError(error, next);
  }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = createOrderSchema.parse(req.body);
    const order = await createOrderService(payload);

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    handleControllerError(error, next);
  }
};
