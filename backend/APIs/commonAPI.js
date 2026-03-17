import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authRouter = express.Router();

// User Registration
authRouter.post('/register', async (req, res) => {
    try {
        let user = req.body;
        user.email = user.email?.trim().toLowerCase();
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const userDoc = await User.create(user);
        
        // Create a copy without the password to send back
        const userObj = userDoc.toObject();
        delete userObj.password;

        res.status(201).json({ message: "User registered successfully", payload: userObj });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User Login
authRouter.post('/login', async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 2. Check if password is correct
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 3. Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ message: "Your account has been deactivated" });
        }

        // 4. Generate JWT
        const secret = process.env.JWT_SECRET || "fallback_secret_key";
        const token = jwt.sign(
            { _id: user._id, role: user.role, email: user.email },
            secret,
            { expiresIn: '7d' } // Token expires in 7 days
        );

        // 5. Send cookie & response
        // In a real production app, add secure: true if using HTTPS
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({
            message: "Login successful",
            payload: userObj
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User Logout
authRouter.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logout successful" });
});
