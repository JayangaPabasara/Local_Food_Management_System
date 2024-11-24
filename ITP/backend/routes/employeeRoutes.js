import express from "express";
import { createEmployee, deleteEmployee, getEmployees } from "../controllers/employeeController.js";

const employeeRouter = express.Router();

employeeRouter.get("/", getEmployees);
employeeRouter.post("/add", createEmployee);
employeeRouter.delete("/delete/:id", deleteEmployee);

export default employeeRouter;