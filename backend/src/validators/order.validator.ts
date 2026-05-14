import { z } from "zod";

export const createOrderItemSchema = z.object({
  productId: z.coerce.number().int().positive("Product id must be a positive integer"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

export const createOrderSchema = z.object({
  customerId: z.coerce.number().int().positive("Customer id must be a positive integer"),
  items: z.array(createOrderItemSchema).min(1, "At least one order item is required"),
});

export const orderIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Order id must be a positive integer"),
});

export const getOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1, "Page must be greater than or equal to 1").default(1),
  limit: z.coerce.number().int().min(1, "Limit must be greater than or equal to 1").max(100, "Limit cannot exceed 100").default(10),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type GetOrdersQueryInput = z.infer<typeof getOrdersQuerySchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
