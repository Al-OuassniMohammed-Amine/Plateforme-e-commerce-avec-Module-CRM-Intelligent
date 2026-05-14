import fs from "fs";
import multer, { MulterError, type FileFilterCallback } from "multer";
import path from "path";
import { type NextFunction, type Request, type Response } from "express";
import { AppError } from "./error-handler.middleware";

const uploadsDirectory = path.join(process.cwd(), "public", "uploads", "products");

fs.mkdirSync(uploadsDirectory, { recursive: true });

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsDirectory);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const rawName = path.basename(file.originalname, extension);
    const safeName = rawName
      .trim()
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);
    const finalName = safeName.length > 0 ? safeName : "product";

    callback(null, `${Date.now()}-${finalName}${extension}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    callback(new Error("Only jpg, jpeg, png and webp images are allowed"));
    return;
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export const uploadProductImage = (req: Request, res: Response, next: NextFunction): void => {
  upload.single("image")(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        next(new AppError("Image size must be 2MB or less", 400));
        return;
      }

      next(new AppError(error.message, 400));
      return;
    }

    if (error instanceof Error) {
      next(new AppError(error.message, 400));
      return;
    }

    next(new AppError("Image upload failed", 400));
  });
};
