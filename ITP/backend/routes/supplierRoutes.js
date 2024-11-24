import express from "express";
import {
  getSuppliers, addSupplier, updateSupplier, deleteSupplier,
  getSupplierById
} from "../controllers/supplierController.js";

const supplierRouter = express.Router();

// Define routes
supplierRouter.get("/", getSuppliers);
supplierRouter.get("/:id", getSupplierById)
supplierRouter.post("/add", addSupplier);
supplierRouter.put("/update/:id", updateSupplier);
supplierRouter.delete("/delete/:id", deleteSupplier);

export default supplierRouter;
