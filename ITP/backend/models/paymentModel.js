import mongoose, { now } from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "pending" },
  date: { type: Date, default: Date.now() },
});

const Payment = mongoose.model("Income", paymentSchema);
export default Payment;
