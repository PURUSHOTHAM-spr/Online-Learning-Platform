import express from "express";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";

export const userRouter = express.Router();


//registration route will be removes easily
userRouter.post('/register', async (req, res) => {
    try {
        const user = req.body;
        const userDoc = await User.create(user);

        res.status(201).json({
            message: "user registered successfully",
            payload: userDoc
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Enroll courses
userRouter.post('/enroll-course/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const courseId = req.body.courseId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "course not found" });
        }

        if (user.coursesEnrolled.includes(courseId)) {
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


userRouter.get('/my-courses/:id', async (req, res) => {
    try {
        const userId = req.params.id;

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