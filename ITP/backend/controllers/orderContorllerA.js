import orderModel from "../models/orderModel.js";
import paymentModel from "../models/paymentModel.js";

// Get all orders with user and payment details
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate('userId', 'name')   // Populating user details
      .populate('paymentId');       // Populating payment details

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
    });
  }
};

// Read a specific order
const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await orderModel.findById(orderId)
      .populate('userId', 'name')
      .populate('paymentId'); // Correctly populate paymentId field
    if (!order) {
      return res.json({ success: false, message: "Order not found." });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.json({ success: false, message: "Error fetching order." });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const updatedData = req.body;

  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, updatedData, { new: true });
    if (!updatedOrder) {
      return res.json({ success: false, message: "Order not found." });
    }
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.json({ success: false, message: "Error updating order." });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const deletedOrder = await orderModel.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.json({ success: false, message: "Order not found." });
    }
    res.json({ success: true, message: "Order deleted successfully." });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.json({ success: false, message: "Error deleting order." });
  }
};

export { getAllOrders, getOrderById, updateOrder, deleteOrder };
