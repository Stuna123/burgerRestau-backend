// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Aucune token fournie" });
        }

        const token = auth.split(" ")[1];

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET missing in env");
            return res.status(500).json({ message: "Erreur serveur: SECRET manquant" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.warn("JWT verify failed:", err.message);
            return res.status(401).json({ message: "Token invalide ou expiré" });
        }

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Utilisateur introuvable" });
        }

        // attach user to request for next middleware/controllers
        req.user = user;
        next();
    } catch (err) {
        console.error("Protect middleware error:", err);
        return res.status(500).json({ message: "Erreur serveur lors de la vérification du token" });
    }
};

export const isAdmin = (req, res, next) => {
    try {
        if (req.user && req.user.role === "admin") {
        return next();
        }
        return res.status(403).json({ message: "Accès refusé (admin seulement)" });
    } catch (err) {
        console.error("isAdmin middleware error:", err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};
