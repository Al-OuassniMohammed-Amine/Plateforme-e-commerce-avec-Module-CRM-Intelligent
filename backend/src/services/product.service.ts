import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/error-handler.middleware";
import {
  type CreateProductInput,
  type GetProductsQueryInput,
  type UpdateProductInput,
} from "../validators/product.validator";

const productInclude = {
  category: true,
} satisfies Prisma.ProductInclude;

const ensureCategoryExists = async (categoryId: number): Promise<void> => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }
};

const ensureProductExists = async (productId: number): Promise<void> => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }
};

export const createProduct = async (payload: CreateProductInput) => {
  await ensureCategoryExists(payload.categoryId);

  return prisma.product.create({
    data: payload,
    include: productInclude,
  });
};

export const getProducts = async (query: GetProductsQueryInput) => {
  const { page, limit, categoryId, search } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};

  if (categoryId !== undefined) {
    where.categoryId = categoryId;
  }

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    meta: {
      page,
      limit,
      total,
    },
  };
};

export const getProductById = async (productId: number) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: productInclude,
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

export const updateProduct = async (productId: number, payload: UpdateProductInput) => {
  await ensureProductExists(productId);

  if (payload.categoryId !== undefined) {
    await ensureCategoryExists(payload.categoryId);
  }

  return prisma.product.update({
    where: { id: productId },
    data: payload,
    include: productInclude,
  });
};

export const deleteProduct = async (productId: number) => {
  await ensureProductExists(productId);

  try {
    return await prisma.product.delete({
      where: { id: productId },
      include: productInclude,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      throw new AppError("Product cannot be deleted because it is linked to existing order items", 409);
    }

    throw error;
  }
};
