import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    name: { 
        type: String, required: true
    },
    phone: {
        type: String, 
        required: true
    },
    address: {
        type: String,
        required: true
    },
    processed: {
        type: Boolean,
        default: false
    },
    
    cart: [
        {
            id: Number,
            name: String,
            description: String,
            price: Number,
            quantity: Number,
            image: String
        }
    ],

    total: { 
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Order", OrderSchema);
