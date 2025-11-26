import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    image: String,
    category: String
});

export default mongoose.model("Product", productSchema)
