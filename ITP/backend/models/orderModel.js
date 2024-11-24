import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Order Processing" },
  date: { type: Date, default: Date.now() },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "payment" }
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
