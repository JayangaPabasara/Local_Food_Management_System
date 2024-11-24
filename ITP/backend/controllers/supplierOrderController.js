import SupplierOrder from "../models/SupplierOrder.js";
import Supplier from "../models/Supplier.js";

// Get all supplier orders
const getSupplierOrders = async (req, res) => {
  try {
    const orders = await SupplierOrder.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new supplier order
const addSupplierOrder = async (req, res) => {
  const { supplier, productName, quantity, unitPrice } = req.body;

  // Check if all required fields are provided
  if (!supplier || !productName || !quantity || !unitPrice) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new supplier order
    const order = new SupplierOrder({
      supplier,
      productName,
      quantity,
      unitPrice,
    });

    // Save the new order
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update supplier order by ID
const updateSupplierOrder = async (req, res) => {
  const { id } = req.params;
  const { product, quantity, unitPrice, totalAmount } = req.body;

  try {
    const order = await SupplierOrder.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.product = product || order.product;
    order.quantity = quantity || order.quantity;
    order.unitPrice = unitPrice || order.unitPrice;
    order.totalAmount = quantity * unitPrice || order.totalAmount;

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete supplier order by ID
const deleteSupplierOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await SupplierOrder.findByIdAndDelete(id);
    if (!deletedOrder)
      return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Supplier order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSupplierOrderById = async (req, res) => {
  const { id } = req.params; // Ensure id is properly destructured from the params
  try {
    const order = await SupplierOrder.findById(id).populate('supplier');
    if (!order) {
      return res.status(404).json({ message: "Supplier order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders by supplier ID
const getSupplierOrdersBySupplierIdNewOne = async (req, res) => {
  const { supplierId } = req.params;
  try {
    const orders = await SupplierOrder.find({ supplier: supplierId }).populate('supplier');
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this supplier" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get suppliers who placed at least one order
const getSuppliersWithOrders = async (req, res) => {
  try {
    // Fetch supplier orders and only select the supplier field
    const supplierOrders = await SupplierOrder.find().select('supplier');
    
    // Extract the supplier IDs from the orders
    const supplierIds = supplierOrders.map((order) => order.supplier);

    // Fetch all unique suppliers who match these IDs
    const suppliers = await Supplier.find({ _id: { $in: supplierIds } });
    
    // Send the suppliers in the response
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
  getSupplierOrders,
  addSupplierOrder,
  updateSupplierOrder,
  deleteSupplierOrder,
  getSupplierOrderById,
  getSuppliersWithOrders,
  getSupplierOrdersBySupplierIdNewOne,
};
