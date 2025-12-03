import express from "express";
import Order from "../models/Order.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 *  Post /api/orders
 *  Création nouvelle commande à partir du front
*/
router.post("/", async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();

        res.json({ message: "Commande enregistrée !", order: newOrder });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// Get : liste des commandes (seulement admin)
router.get("/", protect, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Put mise à jour
router.put("/:id", protect, isAdmin, async(req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!updated) 
            return res.status(404).json({ message: "Commande introuvable" });
        
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/** Get /api/orders
 *  Retourne toutes les commandes

 router.get("/", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

*/

/** PUT /api/orders/:id
 * mettre à jour une commande (ex : status processed)
 * Corps attendu : { processed: true } ou autres champs modifiés.

router.put("/:id", async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        if(!updated) {
            return res.status(404).json({message: "La commande est introuvable"})
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
*/



/**
 * Delete /api/orders/:id
 * supprimer une commande (admin)
*/
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Order.findByIdAndDelete(req.params.id);
        if(!deleted) {
            return res.status(404).json({message: "La commande est introuvable"})
        }
        res.json({message: "La commande a été supprimée avec succès"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

/**
 *  Get /api/orders/stats
 *  petites statistiques : 
 *      - total commandes, 
 *      - CA total, 
 *      - commandes traitées / en attente
*/
router.get("/stats/summary", async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const orders = await Order.find();
        const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
        const processed = orders.filter(o => o.processed).length;
        res.json({
            totalOrders,
            totalRevenue,
            processed,
            pending: totalOrders - processed,
        })
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default router;