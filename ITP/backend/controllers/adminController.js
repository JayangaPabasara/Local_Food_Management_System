import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";

// Create a new admin
const addAdmin = async (req, res) => {
  const { name, email, role, password } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, role, password: hashedPassword });
    await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin added successfully!", admin: newAdmin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding admin", error: error.message });
  }
};

// Admin login functionality
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      // Admin not found
      return res.status(400).json({ message: "Credentials are wrong" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      // Password does not match
      return res.status(400).json({ message: "Credentials are wrong" });
    }

    // If credentials are correct, respond with success and admin details
    return res.status(200).json({
      message: "Login successful",
      adminId: admin._id,
      adminName: admin.name,
      adminEmail: admin.email,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
};

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving admins", error: error.message });
  }
};

// Delete an admin by ID
const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting admin", error: error.message });
  }
};

// Update an admin by ID
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, password } = req.body;

  try {
    const updatedData = { name, email, role };

    // If password is provided, hash it before updating
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res
      .status(200)
      .json({ message: "Admin updated successfully!", admin: updatedAdmin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating admin", error: error.message });
  }
};

export { addAdmin, loginAdmin, getAllAdmins, deleteAdmin, updateAdmin };
