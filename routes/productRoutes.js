import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Get all 
router.get("/", async(req, res) => {
    try {
        const products = await Product.find();
        res.json(products);        
    } catch (error) {
        res.status(500).json({ error: error.message})
    }

});

// Get by category
router.get("/category/:name", async(req, res) => {
    try {
        const products = await Product.find({category: req.params.name});
        res.json(products);        
    } catch (error) {
        res.status(500).json({error: error.message})
    }
});

// Get by id
router.get("/id/:id", async(req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        
        if(!product) {
            return res.status(404).json({message: "Produit introuvable"})
        }
        res.json(product);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Create
router.post("/", async(req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.json({message: "Le produit a été crée.", product: newProduct});   
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// Update
router.put("/:id", async(req, res) => {

    try {
        const updated = await Product.findOneAndUpdate(
            { id: req.params.id},
            req.body,
            { new: true}
        );

        if(!updated) {
            return res.status(404).json({error: error.message})
        }

        res.json(updated)        
    } catch (error) {
        res.status(500).json({error: error.message});
    }

});

// Delete
router.delete("/:id", async(req, res) => {
    try {
        await Product.findOneAndDelete({id: req.params.id});
        res.json({message: "Le produit a été supprimé avec succès."})   
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

export default router;