import { useState, useEffect } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { Link } from "react-router-dom";
import { FiBook, FiAward, FiClock, FiSearch, FiChevronRight, FiPlay, FiStar } from "react-icons/fi";
import { toast } from "react-hot-toast";

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [enrolledRes, allRes] = await Promise.all([
          axiosInstance.get("/user-api/my-courses"),
          axiosInstance.get("/user-api/courses"),
        ]);
        setEnrolledCourses(enrolledRes.data.payload || []);
        setAllCourses(allRes.data.payload || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      await axiosInstance.post("/user-api/enroll-course", { courseId });
      toast.success("Enrolled successfully!");
      const res = await axiosInstance.get("/user-api/my-courses");
      setEnrolledCourses(res.data.payload || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed.");
    } finally {
      setEnrollingId(null);
    }
  };

  const isEnrolled = (courseId) => enrolledCourses.some((c) => c._id === courseId);

  const filteredCourses = allCourses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const levelColor = {
    Beginner: "text-emerald-600 bg-emerald-50",
    Intermediate: "text-amber-600 bg-amber-50",
    Advanced: "text-red-600 bg-red-50",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-violet-700 to-indigo-600 px-8 py-10 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-6">
          <div>
            <p className="text-violet-200 text-sm font-medium mb-1">Welcome back,</p>
            <h1 className="text-3xl font-bold mb-1">
              {user?.firstName} {user?.lastName} 👋
            </h1>
            <p className="text-violet-200 text-sm">Continue your learning journey today.</p>
          </div>
          <div className="flex gap-6">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl text-center">
              <p className="text-3xl font-bold">{enrolledCourses.length}</p>
              <p className="text-violet-200 text-xs mt-1">Enrolled Courses</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl text-center">
              <p className="text-3xl font-bold">{allCourses.length}</p>
              <p className="text-violet-200 text-xs mt-1">Total Courses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* TABS */}
        <div className="flex gap-2 mb-8 border-b border-slate-200">
          {["overview", "my-courses", "explore"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-semibold capitalize rounded-t-lg transition-all ${
                activeTab === tab
                  ? "text-violet-600 border-b-2 border-violet-600 bg-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: <FiBook size={22} />, label: "Enrolled", value: enrolledCourses.length, color: "text-violet-600 bg-violet-100" },
                { icon: <FiStar size={22} />, label: "Available", value: allCourses.length, color: "text-amber-600 bg-amber-100" },
                { icon: <FiAward size={22} />, label: "In Progress", value: enrolledCourses.length, color: "text-emerald-600 bg-emerald-100" },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                  <div className={`p-3 rounded-xl ${stat.color}`}>{stat.icon}</div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CONTINUE LEARNING */}
            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-slate-800">Continue Learning</h2>
                <button onClick={() => setActiveTab("my-courses")} className="text-sm text-violet-600 font-semibold flex items-center gap-1 hover:underline">
                  View all <FiChevronRight size={16} />
                </button>
              </div>
              {enrolledCourses.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                  <FiBook size={40} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">You haven't enrolled in any course yet.</p>
                  <button onClick={() => setActiveTab("explore")} className="mt-4 px-5 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition">
                    Explore Courses
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.slice(0, 3).map((course) => (
                    <CourseCard key={course._id} course={course} enrolled={true} levelColor={levelColor} />
                  ))}
                </div>
              )}
            </div>

            {/* RECOMMENDATIONS */}
            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-slate-800">Recommended For You</h2>
                <button onClick={() => setActiveTab("explore")} className="text-sm text-violet-600 font-semibold flex items-center gap-1 hover:underline">
                  See all <FiChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.filter((c) => !isEnrolled(c._id)).slice(0, 3).map((course) => (
                  <CourseCard key={course._id} course={course} enrolled={false} levelColor={levelColor} onEnroll={handleEnroll} enrollingId={enrollingId} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MY COURSES TAB */}
        {activeTab === "my-courses" && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6">My Enrolled Courses</h2>
            {enrolledCourses.length === 0 ? (
              <div className="bg-white rounded-2xl p-14 text-center shadow-sm">
                <FiBook size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-semibold text-slate-500">No courses yet.</p>
                <p className="text-sm text-slate-400 mt-1">Go explore and enroll in something amazing!</p>
                <button onClick={() => setActiveTab("explore")} className="mt-5 px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition">
                  Explore Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <CourseCard key={course._id} course={course} enrolled={true} levelColor={levelColor} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* EXPLORE TAB */}
        {activeTab === "explore" && (
          <div>
            <div className="flex items-center gap-3 mb-8 bg-white border border-slate-200 rounded-2xl px-5 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-violet-500 transition">
              <FiSearch className="text-slate-400 shrink-0" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses by name or category..."
                className="w-full outline-none text-sm text-slate-700 bg-transparent placeholder-slate-400"
              />
            </div>
            {filteredCourses.length === 0 ? (
              <p className="text-center text-slate-500 py-10">No courses match your search.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    enrolled={isEnrolled(course._id)}
                    levelColor={levelColor}
                    onEnroll={handleEnroll}
                    enrollingId={enrollingId}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course, enrolled, levelColor, onEnroll, enrollingId }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-40 bg-gradient-to-br from-violet-500 to-indigo-600 flex-shrink-0">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-500 group-hover:from-violet-700 group-hover:to-indigo-600 transition-all">
            <FiBook size={36} className="text-white/50" />
          </div>
        )}
        {/* Level badge overlay */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm ${(levelColor[course.courseLevel] || "text-slate-600").split(" ")[0]}`}>
            {course.courseLevel}
          </span>
        </div>
      </div>
      {/* Card Body */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-slate-400 font-medium">{course.category}</span>
        </div>
        <h3 className="font-bold text-slate-800 text-base mb-2 line-clamp-2 leading-snug">
          {course.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
          {course.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-5 border-t border-slate-100 pt-4">
          <span className="flex items-center gap-1"><FiBook size={12} /> {course.sections?.length || 0} Sections</span>
          <span className="flex items-center gap-1"><FiStar size={12} /> {course.rating > 0 ? course.rating.toFixed(1) : "New"}</span>
          <span className="flex items-center gap-1"><FiClock size={12} /> {course.studentsEnrolled} students</span>
        </div>
        {enrolled ? (
          <Link
            to={`/course/${course._id}`}
            className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold text-center flex items-center justify-center gap-2 hover:bg-violet-700 transition"
          >
            <FiPlay size={14} /> Continue Learning
          </Link>
        ) : (
          <button
            onClick={() => onEnroll && onEnroll(course._id)}
            disabled={enrollingId === course._id}
            className="w-full py-2.5 rounded-xl border-2 border-violet-500 text-violet-600 text-sm font-bold hover:bg-violet-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enrollingId === course._id ? "Enrolling..." : "Enroll Now"}
          </button>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;