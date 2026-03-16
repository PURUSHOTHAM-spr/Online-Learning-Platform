import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // Check if token exists in cookies
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify the token
        const secret = process.env.JWT_SECRET || "fallback_secret_key";
        const decoded = jwt.verify(token, secret);
        
        // Attach user info to request object
        req.user = decoded;
        
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token." });
    }
};

export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden. You do not have permission to perform this action." });
        }
        next();
    };
};
