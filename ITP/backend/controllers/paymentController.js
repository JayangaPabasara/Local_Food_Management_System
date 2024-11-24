import Payment from "../models/paymentModel.js";

// Create a new payment
export const createPayment = async (req, res) => {
  try {
    const { orderID, name, email, amount, status = "pending" } = req.body;
    const newPayment = new Payment({ orderID, name, email, amount, status });
    await newPayment.save();
    res.status(201).json({ message: "Payment created successfully" });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }
    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update a payment
export const updatePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a payment
export const deletePayment = async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
