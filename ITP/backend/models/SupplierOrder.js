import mongoose from "mongoose"

// Define the SupplierOrder schema
const supplierOrderSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: [true, 'Supplier is required']
    },
    productName: {
        type: String,
        required: [true, 'Product Name is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be greater than 0']
    },
    unitPrice: {
        type: Number,
        required: [true, 'Unit Price is required'],
        min: [0.01, 'Unit Price must be greater than 0']
    },
    total: {
        type: Number,
        required: false // Ensure this is not required
    }
});

// Pre-save hook to calculate total before validation
supplierOrderSchema.pre('save', function (next) {
    // Calculate total only if quantity and unitPrice are present
    if (this.quantity && this.unitPrice) {
        this.total = this.quantity * this.unitPrice;
    } else {
        this.total = 0; // Default to 0 if no valid calculation can be made
    }
    next();
});

const SupplierOrder = mongoose.model('Supplier-Order', supplierOrderSchema);

export default SupplierOrder;
