import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Product from "../models/Product.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Importation des données.");

        const raw = fs.readFileSync("./data/products.json", "utf-8");
        const json = JSON.parse(raw);

        // fusionne toutes les catégories dans un seul tableau
        const allData = [
            ...json.menus,
            ...json.burgers,
            ...json.snacks,
            ...json.boissons,
            ...json.salades,
            ...json.desserts,
        ];
    
        await Product.deleteMany();
        await Product.insertMany(allData);

        console.log("Données importées.");
        process.exit();
    })
    .catch((err) => console.log(err));
    