import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/error-handler.middleware";
import {
  type CreateOrderInput,
  type GetOrdersQueryInput,
  type UpdateOrderStatusInput,
} from "../validators/order.validator";

type NormalizedItem = {
  productId: number;
  quantity: number;
};

const orderInclude = {
  customer: true,
  orderItems: {
    include: {
      product: true,
    },
  },
} satisfies Prisma.OrderInclude;

const normalizeItems = (items: CreateOrderInput["items"]): NormalizedItem[] => {
  const quantitiesByProductId = new Map<number, number>();

  for (const item of items) {
    const currentQuantity = quantitiesByProductId.get(item.productId) ?? 0;
    quantitiesByProductId.set(item.productId, currentQuantity + item.quantity);
  }

  return Array.from(quantitiesByProductId.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
};

export const getOrders = async (query: GetOrdersQueryInput) => {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      include: orderInclude,
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count(),
  ]);

  return {
    data: orders,
    meta: {
      page,
      limit,
      total,
    },
  };
};

export const getOrderById = async (orderId: number) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
};

export const updateOrderStatus = async (orderId: number, payload: UpdateOrderStatusInput) => {
  const existingOrder = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true },
  });

  if (!existingOrder) {
    throw new AppError("Order not found", 404);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: payload.status,
    },
    include: orderInclude,
  });
};

export const createOrder = async (payload: CreateOrderInput) => {
  const normalizedItems = normalizeItems(payload.items);
  const productIds = normalizedItems.map((item) => item.productId);

  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: { id: payload.customerId },
    });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    const products = await tx.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
      },
    });

    if (products.length !== productIds.length) {
      const existingProductIds = new Set(products.map((product) => product.id));
      const missingProductIds = productIds.filter((productId) => !existingProductIds.has(productId));
      throw new AppError(`Product not found: ${missingProductIds.join(", ")}`, 404);
    }

    const productsById = new Map(products.map((product) => [product.id, product]));
    let totalAmount = new Prisma.Decimal(0);

    const orderItemsData = normalizedItems.map((item) => {
      const product = productsById.get(item.productId);

      if (!product) {
        throw new AppError(`Product not found: ${item.productId}`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for product ${product.name}`, 400);
      }

      const subtotal = product.price.mul(item.quantity);
      totalAmount = totalAmount.add(subtotal);

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    for (const item of normalizedItems) {
      const updateResult = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (updateResult.count === 0) {
        const latestProduct = await tx.product.findUnique({
          where: { id: item.productId },
          select: { name: true },
        });

        if (!latestProduct) {
          throw new AppError(`Product not found: ${item.productId}`, 404);
        }

        throw new AppError(`Insufficient stock for product ${latestProduct.name}`, 400);
      }
    }

    const order = await tx.order.create({
      data: {
        customerId: payload.customerId,
        totalAmount: Number(totalAmount.toFixed(2)),
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return {
      ...order,
      orderItems: order.orderItems.map((orderItem) => ({
        ...orderItem,
        subtotal: orderItem.price.mul(orderItem.quantity).toFixed(2),
      })),
    };
  });
};
