import mongoose from "mongoose";

const deliveryModelSchema = new mongoose.Schema({
    DeliveryId: {
        type: String,
        required: true,
    },
    DeliveryPerson: {
        type: String,
        required: true,
    },
    Locaton: {
        type: String,
        required: true,
    },
    Date: {
        type: String,
        required: true,
    },
    Status: {
        type: String,
        default: "pending" // Set a default value for the Status field
    }
});

const Delivery = mongoose.model("Delivery", deliveryModelSchema);
export default Delivery;