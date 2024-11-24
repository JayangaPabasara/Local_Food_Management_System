// userModel
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },  // Add username field
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address1: { type: String, required: true },  // Add address line 1 field
    address2: { type: String },  // Add address line 2 field (optional)
    hometown: { type: String, required: true },  // Add hometown field
    phone: { type: String, required: true },  // Add phone number field
    cartData: { type: Object, default: {} },
    active: { type: Boolean, default: true }
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
