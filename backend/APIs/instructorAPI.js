import express from "express";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";

export const instructorRouter = express.Router();

instructorRouter.post('/create-course/:id', async(req, res)=>{
    const course = req.body;
    const instructorId = req.params.id;
    
    const instructor = await User.findById(instructorId);
    if(!instructor){
        return res.status(404).json({message: "instructor not found"});
    }
    
    const courseDoc = await Course.create(course);
    courseDoc.instructor = instructorId;
    await courseDoc.save();
    res.json({ message: "course created successfully", payload: courseDoc });
});