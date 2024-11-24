import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { getUserOrders, placeOrder } from "../controllers/orderController.js";
import {
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderContorllerA.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.get("/", getAllOrders);
orderRouter.get("/:orderId", getOrderById);
orderRouter.put("/update/:orderId", updateOrder);
orderRouter.delete("/delete/:orderId", deleteOrder);
orderRouter.get("/user/orders", authMiddleware, getUserOrders);

export default orderRouter;
