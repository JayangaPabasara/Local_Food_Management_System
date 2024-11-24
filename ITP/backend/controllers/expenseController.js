import Expense from '../models/expenseModel.js';

// Create a new expense
export const createExpense = async (req, res) => {
  try {
    const { supplierName, orderID, supplierEmail, totalAmount, orderDate } = req.body;
    const newExpense = new Expense({ supplierName, orderID, supplierEmail, totalAmount, orderDate });
    await newExpense.save();
    res.status(201).json({ message: "Expense created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update an expense
export const updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
