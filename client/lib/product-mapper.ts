import type { ApiProduct, ApiProductWithCategory } from "./api-types";
import type { Product } from "./store";

export type CatalogProduct = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  inStock: boolean;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
};

const DEFAULT_PRODUCT_IMAGE = "/placeholder.jpg";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "") || "http://localhost:5000";

export const resolveProductImageUrl = (imageUrl?: string | null): string => {
  if (!imageUrl || imageUrl.trim().length === 0) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  const trimmedImageUrl = imageUrl.trim();

  if (trimmedImageUrl.startsWith("http://") || trimmedImageUrl.startsWith("https://")) {
    return trimmedImageUrl;
  }

  if (trimmedImageUrl.startsWith("/")) {
    return `${API_BASE_URL}${trimmedImageUrl}`;
  }

  return `${API_BASE_URL}/${trimmedImageUrl}`;
};

const normalizePrice = (value: string | number): number => {
  if (typeof value === "number") {
    return value;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const hasCategory = (product: ApiProduct | ApiProductWithCategory): product is ApiProductWithCategory => {
  return "category" in product;
};

export const mapApiProductToCatalogProduct = (
  product: ApiProduct | ApiProductWithCategory
): CatalogProduct => {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    imageUrl: resolveProductImageUrl(product.imageUrl),
    price: normalizePrice(product.price),
    stock: product.stock,
    inStock: product.stock > 0,
    categoryId: product.categoryId,
    categoryName: hasCategory(product) ? product.category.name : undefined,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

export const mapApiProductsToCatalogProducts = (
  products: Array<ApiProduct | ApiProductWithCategory>
): CatalogProduct[] => {
  return products.map(mapApiProductToCatalogProduct);
};

export const mapApiProductToStoreProduct = (
  product: ApiProduct | ApiProductWithCategory
): Product => {
  const mappedProduct = mapApiProductToCatalogProduct(product);

  return {
    id: String(mappedProduct.id),
    name: mappedProduct.name,
    price: mappedProduct.price,
    image: resolveProductImageUrl(mappedProduct.imageUrl),
    category: String(mappedProduct.categoryId),
    description: mappedProduct.description,
    inStock: mappedProduct.inStock,
  };
};

export const mapApiProductsToStoreProducts = (
  products: Array<ApiProduct | ApiProductWithCategory>
): Product[] => {
  return products.map(mapApiProductToStoreProduct);
};
