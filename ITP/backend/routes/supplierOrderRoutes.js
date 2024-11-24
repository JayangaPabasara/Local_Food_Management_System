import express from "express";
import {
  getSupplierOrders,
  addSupplierOrder,
  updateSupplierOrder,
  deleteSupplierOrder,
  getSupplierOrderById,
  getSuppliersWithOrders,
  getSupplierOrdersBySupplierIdNewOne,
} from "../controllers/supplierOrderController.js";

const suppplierOrderRoute = express.Router();

// Define routes in correct order
suppplierOrderRoute.get('/suppliers-with-orders', getSuppliersWithOrders); // Specific route first
suppplierOrderRoute.get('/by-supplier/:supplierId', getSupplierOrdersBySupplierIdNewOne);
suppplierOrderRoute.get('/:id', getSupplierOrderById); // Wildcard route after specific route
suppplierOrderRoute.get('/', getSupplierOrders);
suppplierOrderRoute.post('/add', addSupplierOrder);
suppplierOrderRoute.put('/update/:id', updateSupplierOrder);
suppplierOrderRoute.delete('/delete/:id', deleteSupplierOrder);

export default suppplierOrderRoute;
