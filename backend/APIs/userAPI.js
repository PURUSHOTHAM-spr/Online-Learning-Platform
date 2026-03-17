import express from "express";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { CourseProgress } from "../models/CourseProgress.js";

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

        const user = await User.findById(userId).populate("coursesEnrolled");

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


// Get the single course details

userRouter.get('/course/:id', async(req, res)=>{
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId)
            .populate("reviews.user", "firstName lastName");
        if (!course) {
            return res.status(404).json({ message: "course not found" });
        }
        res.status(200).json({
            message: "course details",
            payload: course
        });
    } catch(error) {
        res.status(500).json({message: error.message});
    }
})

// Student review and rating

userRouter.post('/review/:courseId', async(req, res)=>{
    try {
        const courseId = req.params.courseId;
        const userId = req.user._id;
        const {rating, review} = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "course not found" });
        }

        const existingReview = course.reviews.find(r => r.user.toString() === userId);
        if (existingReview) {
            return res.status(400).json({ message: "already reviewed this course" });
        }

        course.reviews.push({user: userId, rating, review});
        course.rating = course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length;

        await course.save();

        res.status(200).json({
            message: "review added successfully",
            payload: course
        });
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});


// --- STUDENT PROGRESS APIS ---

// Get Progress for a single course
userRouter.get('/progress/:courseId', async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.params;

        const progress = await CourseProgress.findOne({ user: userId, course: courseId });
        
        if (!progress) {
            return res.status(200).json({ 
                message: "No progress found", 
                payload: { completedLectures: [] } 
            });
        }

        res.status(200).json({
            message: "Progress fetched successfully",
            payload: progress
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark lecture as complete/incomplete
userRouter.post('/progress/:courseId/:lectureId', async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId, lectureId } = req.params;

        // Find or create progress record
        let progress = await CourseProgress.findOne({ user: userId, course: courseId });
        
        if (!progress) {
            progress = new CourseProgress({
                user: userId,
                course: courseId,
                completedLectures: [lectureId]
            });
        } else {
            // Check if lecture is already completed
            const isCompleted = progress.completedLectures.includes(lectureId);
            
            if (isCompleted) {
                // Remove it (toggle off)
                progress.completedLectures = progress.completedLectures.filter(id => id.toString() !== lectureId.toString());
            } else {
                // Add it
                progress.completedLectures.push(lectureId);
            }
            progress.lastAccessed = new Date();
        }

        await progress.save();

        res.status(200).json({
            message: "Progress updated successfully",
            payload: progress
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});