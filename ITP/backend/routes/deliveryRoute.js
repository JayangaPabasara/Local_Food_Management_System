import express from "express";
import Delivery from "../models/deliveryModel.js";

const router = express.Router();

// Create a new delivery entry
router.post("/delivery/save", async (req, res) => {
  try {
    const newDelivery = new Delivery(req.body); // Create a new Delivery instance
    await newDelivery.save(); // Save it to the database
    return res.status(200).json({ success: "Delivery saved successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Get all deliveries
router.get("/deliveries", async (req, res) => {
  try {
    const deliveries = await Delivery.find(); // Fetch all delivery records from the database
    return res.status(200).json({ success: true, deliveries });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Get a specific delivery by ID
router.get("/delivery/:id", async (req, res) => {
  try {
    const deliveryId = req.params.id;
    const delivery = await Delivery.findById(deliveryId); // Fetch delivery by ID

    if (!delivery) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery not found" });
    }

    return res.status(200).json({ success: true, delivery });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Update an existing delivery by ID
router.put("/delivery/update/:id", async (req, res) => {
  try {
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedDelivery) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery not found" });
    }

    return res
      .status(200)
      .json({ success: "Delivery updated successfully", updatedDelivery });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Delete a delivery by ID
router.delete("/delivery/delete/:id", async (req, res) => {
  try {
    const deletedDelivery = await Delivery.findByIdAndDelete(req.params.id); // Delete the delivery by ID

    if (!deletedDelivery) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery not found" });
    }

    return res
      .status(200)
      .json({ success: "Delivery deleted successfully", deletedDelivery });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Existing PUT route for confirming delivery
router.put('/confirm/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, { Status: 'complete' });
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    res.json({ message: 'Delivery confirmed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error confirming delivery' });
  }
});

router.get('/confirm/:id', async (req, res) => {
  try {
    // Use DeliveryId instead of _id
    const delivery = await Delivery.findOneAndUpdate(
      { DeliveryId: req.params.id }, // Search by DeliveryId
      { Status: 'complete' } // Update status to 'complete'
    );

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json({ message: 'Delivery confirmed successfully' });
  } catch (error) {
    console.error('Error confirming delivery:', error);
    res.status(500).json({ message: 'Error confirming delivery', error: error.message });
  }
});

export default router;
