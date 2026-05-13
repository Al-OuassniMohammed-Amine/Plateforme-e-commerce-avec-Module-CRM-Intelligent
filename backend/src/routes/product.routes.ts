import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { uploadProductImage } from "../middlewares/upload.middleware";

const productRouter = Router();

productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", authenticate, authorizeRoles("ADMIN"), uploadProductImage, createProduct);
productRouter.patch("/:id", authenticate, authorizeRoles("ADMIN"), uploadProductImage, updateProduct);
productRouter.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteProduct);

export default productRouter;
