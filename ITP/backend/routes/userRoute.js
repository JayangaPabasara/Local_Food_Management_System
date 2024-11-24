import express from "express";
import { getAllCustomers, addCustomer, deleteCustomer, updateCustomer, loginUser, registerUser, activateDeactivateCustomer, getUserById } from "../controllers/userContorller.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
// Add a customer
userRouter.post('/add', addCustomer);

// Get all customers
userRouter.get('/', getAllCustomers);

//Get user by id
userRouter.get('/:id', getUserById)

// Update customer
userRouter.put('/update/:id', updateCustomer);

// Delete customer
userRouter.delete('/delete/:id', deleteCustomer);

// Activate/Deactivate customer
userRouter.patch('/activate/:id', activateDeactivateCustomer);

export default userRouter;
