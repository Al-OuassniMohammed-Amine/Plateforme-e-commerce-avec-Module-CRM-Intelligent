import { Router } from "express";
import { createOrder, getOrderById, getOrders, updateOrderStatus } from "../controllers/order.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";

const orderRouter = Router();

orderRouter.post("/", authenticate, authorizeRoles("CUSTOMER", "ADMIN"), createOrder);
orderRouter.get("/", authenticate, authorizeRoles("ADMIN"), getOrders);
orderRouter.get("/:id", authenticate, authorizeRoles("ADMIN"), getOrderById);
orderRouter.patch("/:id/status", authenticate, authorizeRoles("ADMIN"), updateOrderStatus);

export default orderRouter;
