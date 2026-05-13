export type UserRole = "ADMIN" | "CUSTOMER";

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  stack?: string;
};

export type ApiCategory = {
  id: number;
  name: string;
  description: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiProduct = {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: string | number;
  stock: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiProductWithCategory = ApiProduct & {
  category: ApiCategory;
};

export type ProductListQueryParams = {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
};

export type CreateProductPayload = {
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  stock: number;
  categoryId: number;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: true;
  token: string;
};

export type AuthTokenPayload = {
  userId: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
};
