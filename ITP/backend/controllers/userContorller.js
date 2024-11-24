import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, massage: "User Doesn't exit" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, massage: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, massage: "Error" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//register user
const registerUser = async (req, res) => {
  const { name, username, password, email, address1, address2, hometown, phone } = req.body;  // Include new fields
  try {
    // Check if user already exists
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({ success: false, massage: "User Already Exists" });
    }

    // Validate email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        massage: "Please Enter a Valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        massage: "Please Enter Strong Password",
      });
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with all fields
    const newUser = new userModel({
      name,
      username,
      email,
      password: hashedPassword,
      address1,
      address2,
      hometown,
      phone,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, massage: "Error" });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

//SITHIJA
// Add a customer
const addCustomer = async (req, res) => {
  const { name, email, address1, address2, hometown, phone, username, password } = req.body;

  if (!name || !email || !address1 || !hometown || !phone || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const existingUsername = await userModel.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCustomer = new userModel({ 
      name, 
      email, 
      address1, 
      address2, 
      hometown,  // Include hometown here
      phone, 
      username, 
      password: hashedPassword 
    });
    
    await newCustomer.save();
    res.status(201).json({ message: 'Customer added successfully', customer: newCustomer });
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ message: 'Error adding customer', error: error.message });
  }
};

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
      const customers = await userModel.find();
      res.json(customers);
  } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
      const customer = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!customer) return res.status(404).send('Customer not found');
      res.json({ message: 'Customer updated successfully', customer });
  } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({ message: 'Error updating customer', error });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
      const customer = await userModel.findByIdAndDelete(req.params.id);
      if (!customer) return res.status(404).send('Customer not found');
      res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ message: 'Error deleting customer', error });
  }
};

// Activate/Deactivate customer
const activateDeactivateCustomer = async (req, res) => {
  try {
      const customer = await userModel.findById(req.params.id);
      if (!customer) return res.status(404).send('Customer not found');
      customer.active = !customer.active;
      await customer.save();
      res.json({ message: 'Customer status updated successfully', customer });
  } catch (error) {
      console.error('Error updating customer status:', error);
      res.status(500).json({ message: 'Error updating customer status', error });
  }
};

export { getAllCustomers, addCustomer, deleteCustomer, updateCustomer, loginUser, registerUser, activateDeactivateCustomer, getUserById };
 