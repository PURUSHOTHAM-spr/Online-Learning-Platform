import express from "express";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const userRouter = express.Router();

// Apply verifyToken middleware to all user routes
userRouter.use(verifyToken);


// Get User Profile
userRouter.get('/profile', async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ message: "User profile fetched successfully", payload: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Enroll courses
userRouter.post('/enroll-course', async (req, res) => {
    try {
        const userId = req.user._id;
        const courseId = req.body.courseId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "course not found" });
        }

        if (user.coursesEnrolled.some(c => c.toString() === courseId)) {
            return res.status(400).json({ message: "already enrolled in this course" });
        }

        user.coursesEnrolled.push(courseId);
        course.studentsEnrolled += 1;

        await user.save();
        await course.save();

        res.status(200).json({
            message: "course enrolled successfully",
            payload: user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


userRouter.get('/my-courses', async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
            .populate("coursesEnrolled");

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        res.status(200).json({
            message: "user courses",
            payload: user.coursesEnrolled
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

userRouter.get('/courses', async (req, res) => {
    try {
        const allCourses = await Course.find();

        res.status(200).json({
            message: "all courses",
            payload: allCourses
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});