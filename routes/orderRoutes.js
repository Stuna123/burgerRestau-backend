import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// Post : Créer une commande
router.post("/", async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();

        res.json({ message: "Commande enregistrée !", order: newOrder });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// Get : Récupérer toutes les commandes pour admin
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default router;