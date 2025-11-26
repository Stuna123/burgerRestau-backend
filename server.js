// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());

// important pour recevoir du json
app.use(express.json())

// routes
app.use("/api/products", productRoutes);

// connexion mongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log(" MongoDB connecté avec succès !");
        app.listen(5000, () => console.log("Serveur lancé sur le port 5000"));
    })
    .catch((err) => console.log(err));