import express from "express";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { verifyToken, authorizeRole } from "../middlewares/verifyToken.js";
import { upload } from "../middlewares/multer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const instructorRouter = express.Router();

// Apply authentication and check if user is an instructor
instructorRouter.use(verifyToken, authorizeRole("INSTRUCTOR", "ADMIN"));

// CREATE COURSE

instructorRouter.post("/create-course", async (req, res) => {
  try {
    const courseData = req.body;
    const instructorId = req.user._id;

    const instructor = await User.findById(instructorId);

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    const courseDoc = await Course.create({
      ...courseData,
      instructor: instructorId
    });

    res.json({
      message: "Course created successfully",
      payload: courseDoc
    });

  } catch (error) {
    res.status(500).json({ message: "Error creating course", error });
  }
});




//   GET ALL COURSES OF INSTRUCTOR

instructorRouter.get("/my-courses", async (req, res) => {
  try {
    const instructorId = req.user._id;

    const courses = await Course.find({ instructor: instructorId });

    if(!courses){
      return res.status(404).json({ message: "Courses not found" });
    }

    res.json({
      message: "Courses fetched successfully",
      payload: courses
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
});


// GET SINGLE COURSE

instructorRouter.get("/course/:courseId", async (req, res) => {
  try {

    const { courseId } = req.params;
    const instructorId = req.user._id;

    const course = await Course.findById(courseId);
    const instructor = await User.findById(instructorId);

    if(!instructor){
      return res.status(404).json({ message: "Instructor not found" });
    }

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if(course.instructor.toString() !== instructorId){
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({
      message: "Course fetched successfully",
      payload: course
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error });
  }
});


// UPDATE COURSE

instructorRouter.put("/update-course/:courseId", async (req, res) => {
  try {

    const { courseId } = req.params;
    const instructorId = req.user._id;
    const updates = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== instructorId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updates,
      { new: true }
    );

    res.json({
      message: "Course updated successfully",
      payload: updatedCourse
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
});


//  DELETE COURSE

instructorRouter.delete("/delete-course/:courseId", async (req, res) => {
  try {

    const { courseId } = req.params;
    const instructorId = req.user._id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== instructorId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Course.findByIdAndDelete(courseId);

    res.json({
      message: "Course deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
});


//  ADD SECTION

instructorRouter.post("/add-section/:courseId", async (req, res) => {
  try {

    const { courseId } = req.params;
    const { sectionTitle } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.sections.push({
      sectionTitle,
      lectures: []
    });

    await course.save();

    res.json({
      message: "Section added successfully",
      payload: course
    });

  } catch (error) {
    res.status(500).json({ message: "Error adding section", error });
  }
});


// UPDATE SECTION

instructorRouter.put("/update-section/:courseId/:sectionId", async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { sectionTitle } = req.body;
    const instructorId = req.user._id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== instructorId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const section = course.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    if (sectionTitle) {
      section.sectionTitle = sectionTitle;
    }

    await course.save();

    res.json({
      message: "Section updated successfully",
      payload: course
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating section", error });
  }
});


// ADD LECTURE

instructorRouter.post("/add-lecture/:courseId/:sectionId", upload.single("video"), async (req, res) => {
  try {

    const { courseId, sectionId } = req.params;
    const { title, description, isPreview } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const section = course.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Handle Cloudinary upload if a video file was included
    let videoUrl = "";
    let duration = "0";

    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResponse) {
        videoUrl = cloudinaryResponse.secure_url;
        duration = cloudinaryResponse.duration ? cloudinaryResponse.duration.toString() : "0";
      }
    }

    if (!videoUrl) {
      return res.status(400).json({ message: "Video file is required and upload must succeed" });
    }

    const lectureData = {
      title,
      description,
      videoUrl,
      duration,
      isPreview: isPreview === 'true' || isPreview === true
    };

    section.lectures.push(lectureData);

    await course.save();

    res.json({
      message: "Lecture added successfully",
      payload: course
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding lecture", error });
  }
});


// Delete section

instructorRouter.delete('/delete-section/:courseId/:sectionId', async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const instructorId = req.user._id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== instructorId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const section = course.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    section.remove();

    await course.save();

    res.json({
      message: "Section deleted successfully",
      payload: course
    });

  } catch (error) {
    res.status(500).json({ message: "Error deleting section", error });
  }
});