import express from "express";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";

export const instructorRouter = express.Router();

// CREATE COURSE

instructorRouter.post("/create-course/:id", async (req, res) => {
  try {

    const courseData = req.body;
    const instructorId = req.params.id;

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

instructorRouter.get("/courses/:id", async (req, res) => {
  try {

    const instructorId = req.params.id;

    const courses = await Course.find({ instructor: instructorId });

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

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
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

instructorRouter.put("/update-course/:courseId/:instructorId", async (req, res) => {
  try {

    const { courseId, instructorId } = req.params;
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

instructorRouter.delete("/delete-course/:courseId/:instructorId", async (req, res) => {
  try {

    const { courseId, instructorId } = req.params;

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



// =============================
// 7️⃣ ADD LECTURE
// =============================
// instructorRouter.post("/add-lecture/:courseId/:sectionId", async (req, res) => {
//   try {

//     const { courseId, sectionId } = req.params;
//     const lectureData = req.body;

//     const course = await Course.findById(courseId);

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     const section = course.sections.id(sectionId);

//     if (!section) {
//       return res.status(404).json({ message: "Section not found" });
//     }

//     section.lectures.push(lectureData);

//     await course.save();

//     res.json({
//       message: "Lecture added successfully",
//       payload: course
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Error adding lecture", error });
//   }
// });