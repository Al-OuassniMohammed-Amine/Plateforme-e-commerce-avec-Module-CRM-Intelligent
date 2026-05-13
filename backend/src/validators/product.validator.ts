import { z } from "zod";

const isValidProductImagePath = (value: string): boolean => {
  return /^\/uploads\/products\/[^/]+$/i.test(value);
};

const isValidHttpImageUrl = (value: string): boolean => {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

const optionalImageUrlSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmedValue = value.trim();
    return trimmedValue.length === 0 ? undefined : trimmedValue;
  },
  z
    .string()
    .refine((value) => isValidHttpImageUrl(value) || isValidProductImagePath(value), {
      message: "Image URL must be a valid URL or an uploaded image path",
    })
    .optional()
);

export const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Product id must be a positive integer"),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  imageUrl: optionalImageUrlSchema,
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.coerce.number().int().positive("Category id must be a positive integer"),
});

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(1, "Name cannot be empty").optional(),
    description: z.string().trim().optional(),
    imageUrl: optionalImageUrlSchema,
    price: z.coerce.number().positive("Price must be greater than 0").optional(),
    stock: z.coerce.number().int().min(0, "Stock cannot be negative").optional(),
    categoryId: z.coerce.number().int().positive("Category id must be a positive integer").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1, "Page must be greater than or equal to 1").default(1),
  limit: z.coerce.number().int().min(1, "Limit must be greater than or equal to 1").max(100, "Limit cannot exceed 100").default(10),
  categoryId: z.coerce.number().int().positive("Category id must be a positive integer").optional(),
  search: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.string().min(1, "Search cannot be empty").max(100, "Search is too long").optional()
  ),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductsQueryInput = z.infer<typeof getProductsQuerySchema>;
