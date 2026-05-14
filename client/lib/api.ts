import { getAuthToken } from "./auth";
import type { ApiErrorResponse } from "./api-types";

const FALLBACK_API_URL = "http://localhost:5000";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "") || FALLBACK_API_URL;

type QueryParamValue = string | number | boolean | null | undefined;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: Record<string, QueryParamValue>;
  body?: unknown;
  token?: string;
  headers?: HeadersInit;
};

export class ApiClientError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiClientError";
  }
}

const buildUrl = (path: string, query?: Record<string, QueryParamValue>): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  if (!query) {
    return url.toString();
  }

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url.toString();
};

const parseJsonSafely = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = "GET", query, body, token, headers } = options;
  const authToken = token ?? getAuthToken();
  const requestHeaders = new Headers(headers);

  if (authToken) {
    requestHeaders.set("Authorization", `Bearer ${authToken}`);
  }

  const isBodyProvided = body !== undefined && body !== null;
  const isFormDataBody = typeof FormData !== "undefined" && body instanceof FormData;

  if (isBodyProvided && !isFormDataBody && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const requestBody = isBodyProvided
    ? isFormDataBody
      ? (body as FormData)
      : JSON.stringify(body)
    : undefined;

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: requestHeaders,
    body: requestBody,
  });

  if (!response.ok) {
    const errorBody = await parseJsonSafely<ApiErrorResponse>(response);
    const message = errorBody?.message || `Request failed with status ${response.status}`;
    throw new ApiClientError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await parseJsonSafely<T>(response);

  if (!data) {
    throw new ApiClientError("Invalid JSON response from API", 500);
  }

  return data;
};

export const apiClient = {
  baseUrl: API_BASE_URL,
  get: <T>(path: string, query?: Record<string, QueryParamValue>, token?: string) =>
    request<T>(path, { method: "GET", query, token }),
  post: <T>(path: string, body?: unknown, token?: string) =>
    request<T>(path, { method: "POST", body, token }),
  patch: <T>(path: string, body?: unknown, token?: string) =>
    request<T>(path, { method: "PATCH", body, token }),
  delete: <T>(path: string, token?: string) => request<T>(path, { method: "DELETE", token }),
};
