import express from "express";
import {
  createPayment,
  getPayments,
  updatePayment,
  deletePayment,
  getPaymentById,
} from "../controllers/paymentController.js";

const paymentRoute = express.Router();

// Create a new payment
paymentRoute.post("/create", createPayment);

// Get all payments
paymentRoute.get("/", getPayments);

paymentRoute.get("/get/:id", getPaymentById);

// Update a payment by ID
paymentRoute.put("/update/:id", updatePayment);

// Delete a payment by ID
paymentRoute.delete("/delete/:id", deletePayment);

export default paymentRoute;
