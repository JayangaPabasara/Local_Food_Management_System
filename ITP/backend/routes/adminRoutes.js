import express from "express";
import {
  addAdmin,
  getAllAdmins,
  deleteAdmin,
  loginAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

// Route to add a new admin
router.post("/add", addAdmin);

// Route to get all admins
router.get("/all", getAllAdmins);

// Route to delete an admin
router.delete("/delete/:id", deleteAdmin);

// Route to login as admin
router.post("/login", loginAdmin);

export default router;
