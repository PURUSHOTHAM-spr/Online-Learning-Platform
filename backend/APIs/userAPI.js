import express from "express";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";

export const userRouter = express.Router();


//registration route will be removes easily
userRouter.post('/register', async(req, res)=>{
    let user = req.body;
    const userDoc = await User.create(user);
    userDoc.save();
    res.json({ message: "user regiestered sucessfully", payload: userDoc });
});

//fetch all courses
userRouter.get('/courses', async(req, res)=>{
    let allCourses = await Course.find();
    res.json({ message: "all courses", payload: allCourses });
})