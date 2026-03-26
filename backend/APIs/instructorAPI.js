import express from "express";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { verifyToken, authorizeRole } from "../middlewares/verifyToken.js";
import { upload } from "../middlewares/multer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import { CourseProgress } from "../models/CourseProgress.js";

config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const instructorRouter = express.Router();

// Apply authentication and check if user is an instructor
instructorRouter.use(verifyToken, authorizeRole("INSTRUCTOR", "ADMIN"));

// GENERATE SIGNED CLOUDINARY UPLOAD PARAMS
// The frontend calls this first, then uploads the file directly to Cloudinary.
instructorRouter.get("/generate-upload-signature", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = "course-videos";
  const paramsToSign = { timestamp, folder };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    signature,
    timestamp,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey:    process.env.CLOUDINARY_API_KEY,
  });
});

// CREATE COURSE

instructorRouter.post("/create-course", upload.single("thumbnail"), async (req, res) => {
  try {
    const courseData = req.body;
    const instructorId = req.user._id;

    const instructor = await User.findById(instructorId);

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Upload thumbnail to Cloudinary if provided
    let thumbnailUrl = "";
    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResponse) {
        thumbnailUrl = cloudinaryResponse.secure_url;
      }
    }

    const courseDoc = await Course.create({
      ...courseData,
      instructor: instructorId,
      thumbnail: thumbnailUrl
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


// GET DASHBOARD STATS

instructorRouter.get("/dashboard-stats", async (req, res) => {
  try {
    const instructorId = req.user._id;

    // 1. Fetch courses for this instructor
    const courses = await Course.find({ instructor: instructorId });

    if (!courses) {
      return res.status(404).json({ message: "Courses not found for stats" });
    }

    const courseIds = courses.map(c => c._id);
    let totalStudents = 0;
    let totalRevenue = 0;
    let activeCount = 0;
    let totalRating = 0;
    let totalRatingCount = 0;
    const categoryCount = {};

    courses.forEach(c => {
      const enrolled = c.studentsEnrolled || 0;
      totalStudents += enrolled;
      totalRevenue += enrolled * (c.price || 0);

      if (c.isActive) activeCount++;

      if (c.rating && c.ratingCount) {
        totalRating += c.rating * c.ratingCount;
        totalRatingCount += c.ratingCount;
      }

      if (c.category) {
        categoryCount[c.category] = (categoryCount[c.category] || 0) + enrolled;
      }
    });

    const averageRating = totalRatingCount > 0 ? (totalRating / totalRatingCount).toFixed(1) : "0.0";

    const categoriesData = Object.keys(categoryCount).map(category => ({
      label: category,
      count: categoryCount[category],
      percent: totalStudents > 0 ? Math.round((categoryCount[category] / totalStudents) * 100) : 0
    })).sort((a, b) => b.percent - a.percent);

    // 2. Fetch CourseProgress for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start of that month

    const progressRecords = await CourseProgress.find({
      course: { $in: courseIds },
      createdAt: { $gte: sixMonthsAgo }
    }).populate("course", "price");

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = [];
    const chartDataMap = {}; // Maps "YYYY-MM" to index in chartData

    for(let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth();
      const key = `${year}-${month}`;
      chartDataMap[key] = chartData.length;
      chartData.push({
        name: monthNames[month],
        revenue: 0
      });
    }

    progressRecords.forEach(record => {
      // Must compute from createdAt of the progress record
      const crDate = new Date(record.createdAt);
      const key = `${crDate.getFullYear()}-${crDate.getMonth()}`;
      if (chartDataMap[key] !== undefined) {
        const index = chartDataMap[key];
        const price = (record.course && record.course.price) ? record.course.price : 0;
        chartData[index].revenue += price;
      }
    });

    res.json({
      message: "Dashboard stats fetched successfully",
      payload: {
        stats: {
          totalStudents,
          totalRevenue,
          activeCount,
          averageRating
        },
        categoriesData,
        chartData
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
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

    console.log("UPDATE COURSE REQUEST:", { courseId, instructorId, updates });

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

    console.log("UPDATED COURSE IN DB:", updatedCourse);

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

instructorRouter.post("/add-lecture/:courseId/:sectionId", async (req, res) => {
  try {

    const { courseId, sectionId } = req.params;
    const { title, description, isPreview, videoUrl, duration } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ message: "videoUrl is required" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const section = course.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    section.lectures.push({
      title,
      description: description || "",
      videoUrl,
      duration: duration || "0",
      isPreview: isPreview === 'true' || isPreview === true
    });

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

    course.sections.pull(sectionId);

    await course.save();

    res.json({
      message: "Section deleted successfully",
      payload: course
    });

  } catch (error) {
    res.status(500).json({ message: "Error deleting section", error: error.message });
  }
});


// Delete Lecture

instructorRouter.delete('/delete-lecture/:courseId/:sectionId/:lectureId', async (req, res) => {
  try {
    const { courseId, sectionId, lectureId } = req.params;
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

    const lecture = section.lectures.id(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    section.lectures.pull(lectureId);

    await course.save();

    res.json({
      message: "Lecture deleted successfully",
      payload: course
    });

  } catch (error) {
    res.status(500).json({ message: "Error deleting lecture", error: error.message });
  }
});


// GET COURSE ANALYTICS

instructorRouter.get("/analytics/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user._id;

    // 1. Verify course ownership
    const course = await Course.findById(courseId).populate("sections.lectures");
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.instructor.toString() !== instructorId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 2. Fetch all progress records for this course
    // Also populate user to get names for the leaderboard
    const progressRecords = await CourseProgress.find({ course: courseId }).populate("user", "firstName lastName email profilePic");

    // Total enrollment (from course model or progress records)
    const totalEnrolled = course.studentsEnrolled || progressRecords.length;

    // 3. Extranct total lectures count
    let allLectures = [];
    course.sections.forEach(sec => {
      if (sec.lectures) allLectures.push(...sec.lectures);
    });
    const totalLecturesCount = allLectures.length;

    if (totalLecturesCount === 0 || progressRecords.length === 0) {
      return res.json({
        message: "No analytics data available yet",
        payload: {
          averageCompletionRate: 0,
          totalStudentsContext: totalEnrolled,
          lectureDropOffs: [],
          topStudents: []
        }
      });
    }

    // 4. Calculate Average Completion Rate & Top Students
    let totalPctSum = 0;
    const studentStats = progressRecords.map(record => {
      const completedCount = record.completedLectures.length;
      const pct = Math.round((completedCount / totalLecturesCount) * 100);
      totalPctSum += pct;
      return {
        user: record.user,
        completedCount,
        completionPercentage: pct,
        lastAccessed: record.lastAccessed
      };
    });

    const averageCompletionRate = Math.round(totalPctSum / progressRecords.length);

    // Sort students by completion % desc, then by last accessed
    studentStats.sort((a, b) => b.completionPercentage - a.completionPercentage);
    const topStudents = studentStats.slice(0, 10); // Top 10 leaderboard

    // 5. Calculate Drop-off Rates per Lecture
    // Count how many students completed each specific lecture
    const lectureCompletionCounts = {};
    allLectures.forEach(l => lectureCompletionCounts[l._id] = 0);

    progressRecords.forEach(record => {
      record.completedLectures.forEach(lId => {
        if (lectureCompletionCounts[lId] !== undefined) {
          lectureCompletionCounts[lId]++;
        }
      });
    });

    // Format for charting
    const lectureDropOffs = allLectures.map((l, index) => {
      const completes = lectureCompletionCounts[l._id] || 0;
      const pct = Math.round((completes / progressRecords.length) * 100);
      return {
        id: l._id,
        title: l.title,
        index: index + 1,
        completedBy: completes,
        completionRate: pct
      };
    });

    res.json({
      message: "Analytics fetched successfully",
      payload: {
        averageCompletionRate,
        totalEnrolled,
        totalActiveProgress: progressRecords.length,
        lectureDropOffs,
        topStudents
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error: error.message });
  }
});


// GET GLOBAL REVIEWS ANALYTICS

instructorRouter.get("/global-reviews-analytics", async (req, res) => {
  try {
    const instructorId = req.user._id;

    // 1. Fetch all courses for this instructor
    const courses = await Course.find({ instructor: instructorId })
      .populate("reviews.user", "firstName lastName profilePic");

    if (!courses || courses.length === 0) {
      return res.json({
        message: "No courses found",
        payload: {
          reviews: [],
          globalAverageCompletion: 0,
          totalActiveLearners: 0,
          totalEnrolled: 0
        }
      });
    }

    // 2. Aggregate all reviews across all courses
    let allReviews = [];
    let totalEnrolledContext = 0;
    
    // We also need all course IDs to fetch progress records
    const courseIds = courses.map(c => c._id);

    // Calculate total enrolled across all courses
    courses.forEach(c => {
      totalEnrolledContext += (c.studentsEnrolled || 0);
      
      if (c.reviews && c.reviews.length > 0) {
        c.reviews.forEach(review => {
          // Convert Mongoose subdocument to plain object so we can append data
          const revObj = review.toObject();
          revObj.course = { _id: c._id, title: c.title }; 
          
          // Calculate total lectures for this specific course
          let totalLec = 0;
          c.sections.forEach(sec => {
            if (sec.lectures) totalLec += sec.lectures.length;
          });
          revObj.courseTotalLectures = totalLec;
          
          allReviews.push(revObj);
        });
      }
    });

    // 3. Fetch all progress records for these courses
    const allProgressRecords = await CourseProgress.find({ course: { $in: courseIds } });
    
    const totalActiveLearners = allProgressRecords.length;

    // Calculate Global Average Completion
    let globalTotalPctSum = 0;
    
    // Create a fast lookup map for student progress: progressMap[courseId][userId] = completionPct
    const progressMap = {};
    
    allProgressRecords.forEach(record => {
      const cIdStr = record.course.toString();
      const uIdStr = record.user.toString();
      
      if (!progressMap[cIdStr]) progressMap[cIdStr] = {};
      
      // Calculate this record's completion %
      const courseObj = courses.find(c => c._id.toString() === cIdStr);
      let tLec = 0;
      if (courseObj) {
        courseObj.sections.forEach(sec => { if (sec.lectures) tLec += sec.lectures.length; });
      }
      
      let pct = 0;
      if (tLec > 0) {
        pct = Math.round((record.completedLectures.length / tLec) * 100);
      }
      
      progressMap[cIdStr][uIdStr] = pct;
      globalTotalPctSum += pct;
    });

    const globalAverageCompletion = totalActiveLearners > 0 
      ? Math.round(globalTotalPctSum / totalActiveLearners) 
      : 0;

    // 4. Attach completion % to each review
    allReviews = allReviews.map(review => {
      let studentCompletionPct = 0;
      
      if (review.user && review.user._id) {
        const uId = review.user._id.toString();
        const cId = review.course._id.toString();
        
        if (progressMap[cId] && progressMap[cId][uId] !== undefined) {
          studentCompletionPct = progressMap[cId][uId];
        }
      }
      
      return {
        ...review,
        studentCompletionPct
      };
    });

    // Sort newest reviews first
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      message: "Global reviews analytics fetched successfully",
      payload: {
        reviews: allReviews,
        globalAverageCompletion,
        totalActiveLearners,
        totalEnrolled: totalEnrolledContext
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching global analytics", error: error.message });
  }
});