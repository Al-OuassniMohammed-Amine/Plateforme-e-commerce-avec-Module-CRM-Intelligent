import { Router } from "express";
import authRouter from "./auth.routes";
import categoryRouter from "./category.routes";
import healthRouter from "./health.routes";
import orderRouter from "./order.routes";
import productRouter from "./product.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/categories", categoryRouter);
router.use("/health", healthRouter);
router.use("/orders", orderRouter);
router.use("/products", productRouter);

export default router;
