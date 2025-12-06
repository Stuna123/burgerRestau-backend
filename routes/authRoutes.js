// backend/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

console.log("DEBUG SECRET IN AUTH:", process.env.JWT_SECRET);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const SALT = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10");

router.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "Email et mot de passe requis" });

        const exists = await User.findOne({ email });
        if (exists)
            return res.status(400).json({ message: "Utilisateur existe déjà" });

        const hash = await bcrypt.hash(password, SALT);

        const user = new User({ email, password: hash, name, role: "admin" });
        await user.save();

        res.status(201).json({ message: "Admin créé avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Identifiants invalides" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: "Identifiants invalides" });

        const payload = { id: user._id, email: user.email, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json({
            token,
            user: { id: user._id, email: user.email, name: user.name, role: user.role }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
