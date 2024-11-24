import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid';

const supplierSchema = new mongoose.Schema({
    supplierId: {
        type: String,
        unique: true,
        default: uuidv4, // Automatically generates a unique ID
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    address: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: 'Phone number must be 10 digits'
        }
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
