import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/cartController.js";
import authMiddleware from "../middlewares/auth.js";

const cartRouter = express.Router();

//add cart route
cartRouter.post("/add", authMiddleware, addToCart);
//remove fromt cart route
cartRouter.post("/remove", authMiddleware, removeFromCart);
//get from cart route
cartRouter.post("/get", authMiddleware, getCart);

export default cartRouter;
