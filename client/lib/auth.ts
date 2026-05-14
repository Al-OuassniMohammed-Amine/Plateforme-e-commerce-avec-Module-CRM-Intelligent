import type { AuthTokenPayload, UserRole } from "./api-types";

export const AUTH_TOKEN_STORAGE_KEY = "ecommerce_crm_access_token";

const isBrowser = (): boolean => typeof window !== "undefined";

const decodeJwtPayload = (token: string): AuthTokenPayload | null => {
  if (!isBrowser()) {
    return null;
  }

  const tokenParts = token.split(".");

  if (tokenParts.length !== 3) {
    return null;
  }

  try {
    const base64Url = tokenParts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded = window.atob(padded);
    const payload = JSON.parse(decoded) as Partial<AuthTokenPayload>;

    if (
      typeof payload.userId !== "number" ||
      typeof payload.email !== "string" ||
      (payload.role !== "ADMIN" && payload.role !== "CUSTOMER")
    ) {
      return null;
    }

    return payload as AuthTokenPayload;
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
};

export const getAuthToken = (): string | null => {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
};

export const clearAuthToken = (): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
};

export const getAuthUser = (): AuthTokenPayload | null => {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  return decodeJwtPayload(token);
};

export const getAuthUserRole = (): UserRole | null => {
  return getAuthUser()?.role ?? null;
};

export const isTokenExpired = (): boolean => {
  const user = getAuthUser();

  if (!user || typeof user.exp !== "number") {
    return true;
  }

  return Date.now() >= user.exp * 1000;
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();

  if (!token) {
    return false;
  }

  return !isTokenExpired();
};

export const hasRequiredRole = (allowedRoles: UserRole[]): boolean => {
  const role = getAuthUserRole();

  if (!role) {
    return false;
  }

  return allowedRoles.includes(role);
};
