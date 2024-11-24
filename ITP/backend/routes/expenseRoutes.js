import express from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

router.post("/create", createExpense);
router.get("/", getExpenses);
router.get("/:id", getExpenseById);
router.put("/update/:id", updateExpense);
router.delete("/delete/:id", deleteExpense);

export default router;
