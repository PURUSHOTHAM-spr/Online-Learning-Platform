import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { FiPlus, FiBook, FiTrash2, FiEdit3, FiUsers, FiStar, FiClock } from "react-icons/fi";

const levelColor = {
  Beginner:     "text-emerald-700 bg-emerald-50 border-emerald-200",
  Intermediate: "text-amber-700   bg-amber-50   border-amber-200",
  Advanced:     "text-red-700     bg-red-50     border-red-200",
};

export default function InstructorMyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/instructor-api/my-courses");
      setCourses(res.data.payload || []);
    } catch (err) {
      toast.error("Failed to load your courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await axiosInstance.delete(`/instructor-api/delete-course/${courseId}`);
      toast.success("Course deleted successfully");
      setCourses(courses.filter(c => c._id !== courseId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete course");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-slate-500 mt-1">Manage the courses you've created.</p>
        </div>
        <Link 
          to="/create-course"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <FiPlus size={18} /> Create New Course
        </Link>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBook size={32} />
          </div>
          <h2 className="text-xl font-bold mb-2">No courses yet</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            You haven't created any courses yet. Start sharing your knowledge by creating your first course today!
          </p>
          <Link 
            to="/create-course"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <FiPlus size={18} /> Create Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map(course => (
            <div key={course._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
              
              {/* Thumbnail */}
              <div className="aspect-video relative bg-slate-100 overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    <FiBook size={32} className="opacity-50" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                    ₹{course.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${levelColor[course.courseLevel] || 'bg-slate-100 text-slate-600'}`}>
                    {course.courseLevel}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">
                    {course.category}
                  </span>
                </div>

                <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2" title={course.title}>
                  {course.title}
                </h3>

                <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium"><FiUsers className="text-blue-500" /> {course.studentsEnrolled || 0}</span>
                  <span className="flex items-center gap-1.5 font-medium"><FiStar className="text-amber-400" /> {course.rating > 0 ? course.rating.toFixed(1) : 'New'}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
                <Link
                  to={`/instructor/course/${course._id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <FiEdit3 size={15} /> Manage
                </Link>
                <div className="w-px h-4 bg-slate-200"></div>
                <button
                  onClick={() => handleDelete(course._id, course.title)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <FiTrash2 size={15} /> Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
