import { type UserRole } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError } from "./error-handler.middleware";

type AuthTokenPayload = {
  userId: number;
  email: string;
  role: UserRole;
};

const isValidUserRole = (value: unknown): value is UserRole => {
  return value === "ADMIN" || value === "CUSTOMER";
};

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authorizationHeader = req.header("authorization");

  if (!authorizationHeader) {
    next(new AppError("Authorization token is missing", 401));
    return;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    next(new AppError("Invalid authorization format. Use Bearer <token>", 401));
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    next(new AppError("JWT_SECRET is not configured", 500));
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (typeof decoded !== "object" || decoded === null) {
      next(new AppError("Invalid token payload", 401));
      return;
    }

    const payload = decoded as Partial<AuthTokenPayload>;

    if (
      typeof payload.userId !== "number" ||
      typeof payload.email !== "string" ||
      !isValidUserRole(payload.role)
    ) {
      next(new AppError("Invalid token payload", 401));
      return;
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new AppError("Token has expired", 401));
      return;
    }

    if (error instanceof JsonWebTokenError) {
      next(new AppError("Invalid token", 401));
      return;
    }

    next(error);
  }
};

export const authorizeRoles =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError("Unauthorized", 401));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError("Forbidden: insufficient permissions", 403));
      return;
    }

    next();
  };
