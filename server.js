import dotenv from "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";

console.log("SECRET =",process.env.JWT_SECRET); // doit afficher ta clé ou undefined !!
console.log("SECRET =", JSON.stringify(process.env.JWT_SECRET));
//console.log("ALL ENV =", process.env);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connecté !");
        app.listen(PORT, () => console.log("Serveur lancé sur", PORT));
    })
    .catch(err => console.log(err));
