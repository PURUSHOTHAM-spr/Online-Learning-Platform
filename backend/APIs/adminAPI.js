import express from 'express';
import { User } from '../models/User.js';
import { verifyToken, authorizeRole } from '../middlewares/verifyToken.js';

export const adminRouter = express.Router();

// Apply authentication and check if user is an ADMIN
adminRouter.use(verifyToken, authorizeRole("ADMIN"));

// VIEW ALL USERS
adminRouter.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({
            message: "Users fetched successfully",
            payload: users
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

// USER STATUS CONTROL (Activate/Deactivate)
adminRouter.patch("/users/:userId/status", async (req, res) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({ message: "isActive field must be a boolean" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { isActive },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            payload: user
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating user status", error: error.message });
    }
});

// ROLE MANAGEMENT (Change user role)
adminRouter.patch("/users/:userId/role", async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        const validRoles = ["STUDENT", "INSTRUCTOR", "ADMIN"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role provided" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User role updated successfully",
            payload: user
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating user role", error: error.message });
    }
});
