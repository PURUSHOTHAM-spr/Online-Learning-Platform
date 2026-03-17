import express from 'express';
import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
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

// GET ALL COURSES (Admin view with instructor details)
adminRouter.get("/courses", async (req, res) => {
    try {
        const courses = await Course.find().populate("instructor", "firstName lastName email");
        res.json({
            message: "Courses fetched successfully",
            payload: courses
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error: error.message });
    }
});

// TOGGLE COURSE STATUS (Activate/Deactivate)
adminRouter.patch("/courses/:courseId/status", async (req, res) => {
    try {
        const { courseId } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({ message: "isActive field must be a boolean" });
        }

        const course = await Course.findByIdAndUpdate(
            courseId,
            { isActive },
            { new: true }
        ).populate("instructor", "firstName lastName email");

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({
            message: `Course ${isActive ? 'activated' : 'deactivated'} successfully`,
            payload: course
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating course status", error: error.message });
    }
});

// PLATFORM STATISTICS
adminRouter.get("/stats", async (req, res) => {
    try {
        const [users, courses] = await Promise.all([
            User.find().select("-password"),
            Course.find()
        ]);

        const totalUsers = users.length;
        const students = users.filter(u => u.role === "STUDENT").length;
        const instructors = users.filter(u => u.role === "INSTRUCTOR").length;
        const admins = users.filter(u => u.role === "ADMIN").length;
        const activeUsers = users.filter(u => u.isActive).length;
        const inactiveUsers = totalUsers - activeUsers;

        const totalCourses = courses.length;
        const activeCourses = courses.filter(c => c.isActive).length;
        const totalEnrollments = courses.reduce((sum, c) => sum + (c.studentsEnrolled || 0), 0);
        const totalReviews = courses.reduce((sum, c) => sum + (c.reviews?.length || 0), 0);
        const avgRating = courses.length > 0
            ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.filter(c => c.rating > 0).length || 0).toFixed(1)
            : "0.0";

        // Monthly user signups (last 6 months)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();
        const monthlySignups = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            const count = users.filter(u => {
                const created = new Date(u.createdAt);
                return created >= d && created < nextMonth;
            }).length;
            monthlySignups.push({ name: monthNames[d.getMonth()], users: count });
        }

        res.json({
            message: "Stats fetched successfully",
            payload: {
                totalUsers,
                students,
                instructors,
                admins,
                activeUsers,
                inactiveUsers,
                totalCourses,
                activeCourses,
                totalEnrollments,
                totalReviews,
                avgRating,
                monthlySignups
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats", error: error.message });
    }
});
