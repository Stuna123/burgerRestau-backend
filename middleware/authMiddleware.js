import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if(!auth || !auth.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Aucune permission/autorisation" });
        }

        const decoded   = jwt.verify(token, process.env.JWT_SECRET);
        const token     = auth.split(" ")[1];
        const user      = await User.findById(decoded.id).select("-password");
        if(!user) {
            return res.status(401).json({ message: "Utilisateur introuvable!"})
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token invalide ou expiré" })
    }
}

// Vérifier rôle de l'administrateur
export const isAdmin = (req, res, next) => {
    if(req.user && req.user.role === "admin") return next();
    return res.status(403).json({ message: "Accès refusé (admin seulement)" })
}