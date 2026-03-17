import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { Link } from "react-router-dom";
import { FiBook, FiStar, FiClock, FiPlay, FiSearch, FiAlertCircle } from "react-icons/fi";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/user-api/my-courses");
      setCourses(res.data.payload || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const levelColor = {
    Beginner: "text-emerald-600 bg-emerald-50 border border-emerald-200",
    Intermediate: "text-amber-600 bg-amber-50 border border-amber-200",
    Advanced: "text-red-600 bg-red-50 border border-red-200",
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === "All" || c.courseLevel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      
      {/* PAGE HEADER */}
      <div className="bg-gradient-to-r from-violet-700 to-indigo-600 px-8 py-12 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-violet-200 text-sm font-medium mb-2">Your Library</p>
          <h1 className="text-4xl font-bold mb-2">My Courses</h1>
          <p className="text-violet-200">
            {courses.length > 0
              ? `You are enrolled in ${courses.length} course${courses.length > 1 ? "s" : ""}.`
              : "You haven't enrolled in any courses yet."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* FILTERS & SEARCH */}
        {courses.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {/* Search */}
            <div className="flex items-center gap-3 flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-violet-500 transition">
              <FiSearch className="text-slate-400 shrink-0" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your courses..."
                className="w-full outline-none text-sm text-slate-700 bg-transparent placeholder-slate-400"
              />
            </div>

            {/* Level Filter */}
            <div className="flex gap-2 flex-wrap">
              {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    filterLevel === level
                      ? "bg-violet-600 text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-600"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mb-6">
              <FiBook size={36} className="text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">No courses yet</h2>
            <p className="text-slate-400 max-w-sm mb-8">
              You haven't enrolled in any courses. Explore our catalog and start your learning journey today!
            </p>
            <Link
              to="/all-courses"
              className="px-8 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition shadow-lg shadow-violet-200"
            >
              Explore Courses
            </Link>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <FiAlertCircle size={36} className="text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-600 mb-2">No results found</h2>
            <p className="text-slate-400 text-sm">Try a different search term or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden h-44 flex-shrink-0">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-500">
                      <FiBook size={36} className="text-white/50" />
                    </div>
                  )}
                  {/* Level badge overlay */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm ${(levelColor[course.courseLevel] || "text-slate-600 bg-slate-100").split(" ")[0]}`}>
                      {course.courseLevel}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-xs text-slate-700 font-medium bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-200">
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Title */}
                  <h2 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 leading-snug group-hover:text-violet-700 transition-colors">
                    {course.title}
                  </h2>

                  {/* Description */}
                  <p className="text-slate-500 text-sm line-clamp-3 mb-5 flex-1 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Course Outcomes preview */}
                  {course.courseOutcomes?.length > 0 && (
                    <div className="mb-5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">What you'll learn</p>
                      <ul className="space-y-1.5">
                        {course.courseOutcomes.slice(0, 2).map((outcome, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="text-violet-500 mt-0.5 shrink-0">✓</span>
                            <span className="line-clamp-1">{outcome}</span>
                          </li>
                        ))}
                        {course.courseOutcomes.length > 2 && (
                          <li className="text-xs text-violet-500 font-medium">+{course.courseOutcomes.length - 2} more outcomes</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-100 pt-4 mb-5">
                    <span className="flex items-center gap-1.5">
                      <FiBook size={13} className="text-slate-400" />
                      {course.sections?.length || 0} Sections
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiStar size={13} className="text-amber-400" />
                      {course.rating > 0 ? course.rating.toFixed(1) : "New"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiClock size={13} className="text-slate-400" />
                      {course.studentsEnrolled} students
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to={`/course/${course._id}`}
                    className="w-full py-3 rounded-xl bg-violet-600 text-white text-sm font-bold text-center flex items-center justify-center gap-2 hover:bg-violet-700 transition shadow-md shadow-violet-100 group-hover:shadow-violet-200"
                  >
                    <FiPlay size={14} />
                    Continue Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCourses;