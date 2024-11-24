import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
  try {
    // Create new order object
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address
    });

    // Save the order in the database
    const savedOrder = await newOrder.save();

    // Empty the user's cart after placing the order
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Respond with success and the orderId
    return res.status(200).json({ success: true, orderId: savedOrder._id });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ success: false, message: "Error placing order" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    // Fetch all orders where userId matches the logged-in user
    const orders = await orderModel.find({ userId: req.body.userId }).populate("userId");

    if (!orders) {
      return res.status(404).json({ success: false, message: "No orders found for this user" });
    }

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({ success: false, message: "Error fetching user orders" });
  }
};

export { placeOrder, getUserOrders };
