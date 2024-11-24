import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  orderID: { type: String, required: true },
  supplierEmail: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, required: true },
});

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
