import { useState, useEffect } from "react";
import { axiosInstance } from "../api/axiosInstance";
import {
  FiUser, FiMail, FiBook, FiCalendar,
  FiCheckCircle, FiAward, FiPlay, FiStar
} from "react-icons/fi";
import { Link } from "react-router-dom";

function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, coursesRes] = await Promise.all([
          axiosInstance.get("/user-api/profile"),
          axiosInstance.get("/user-api/my-courses"),
        ]);
        setProfile(profileRes.data.payload);
        setEnrolledCourses(coursesRes.data.payload || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const initials = profile
    ? `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  // Simulate a deterministic progress value per course for visual demo
  const getProgress = (course) => {
    const totalLectures = course.sections?.reduce(
      (acc, s) => acc + (s.lectures?.length || 0), 0
    ) || 0;
    if (totalLectures === 0) return 0;
    // In a real app this would come from a user-progress API
    // For now we show a deterministic % based on course id last char
    const seed = parseInt(course._id?.slice(-2) || "40", 16);
    return Math.min(Math.max(seed % 90 + 10, 10), 90);
  };

  const levelColor = {
    Beginner: "text-emerald-600 bg-emerald-50 border-emerald-200",
    Intermediate: "text-amber-600 bg-amber-50 border-amber-200",
    Advanced: "text-red-600 bg-red-50 border-red-200",
  };

  const progressColor = (pct) => {
    if (pct < 30) return "bg-red-400";
    if (pct < 70) return "bg-amber-400";
    return "bg-emerald-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <p className="text-slate-500">Could not load profile. Please try again.</p>
      </div>
    );
  }

  const joinedDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const totalLectures = enrolledCourses.reduce(
    (acc, c) => acc + (c.sections?.reduce((a, s) => a + (s.lectures?.length || 0), 0) || 0), 0
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* BANNER */}
      <div className="h-52 bg-gradient-to-r from-violet-700 via-indigo-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(white 1.5px, transparent 1.5px)", backgroundSize: "30px 30px" }}>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-violet-900/30 to-transparent"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">

        {/* PROFILE HEADER CARD */}
        <div className="bg-white rounded-3xl shadow-xl -mt-20 relative z-10 overflow-hidden">
          <div className="px-8 pt-8 pb-8 flex items-start gap-6 flex-wrap">

            {/* Avatar */}
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-white text-4xl font-black shadow-2xl -mt-16 ring-4 ring-white flex-shrink-0">
              {initials}
            </div>

            {/* Name & Info */}
            <div className="flex-1 min-w-0 pt-2">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl font-extrabold text-slate-800">
                  {profile.firstName} {profile.lastName}
                </h1>
                <span className="text-xs font-bold px-3 py-1 rounded-full border text-violet-700 bg-violet-100 border-violet-200">
                  Student
                </span>
                {profile.isActive && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <FiCheckCircle size={11} /> Active
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm mb-4">{profile.email}</p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: <FiBook size={15} />, label: "Courses", value: enrolledCourses.length },
                  { icon: <FiAward size={15} />, label: "Lectures", value: totalLectures },
                  { icon: <FiCalendar size={15} />, label: "Joined", value: joinedDate },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-500">
                    <span className="text-violet-500">{s.icon}</span>
                    <span className="text-sm"><span className="font-bold text-slate-700">{s.value}</span> {s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DETAIL GRID */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <FiUser size={18} className="text-violet-500" />, label: "Full Name", value: `${profile.firstName} ${profile.lastName}` },
            { icon: <FiMail size={18} className="text-violet-500" />, label: "Email", value: profile.email },
            { icon: <FiBook size={18} className="text-violet-500" />, label: "Enrolled", value: `${enrolledCourses.length} courses` },
            { icon: <FiCalendar size={18} className="text-violet-500" />, label: "Member Since", value: joinedDate },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 hover:border-violet-200 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                <p className="text-sm font-bold text-slate-700 truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* COURSE PROGRESS */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-slate-800">My Learning Progress</h2>
            <Link to="/my-courses" className="text-sm font-semibold text-violet-600 hover:underline flex items-center gap-1">
              View All <FiBook size={14} />
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-14 text-center shadow-sm border border-slate-100">
              <FiBook size={40} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No enrolled courses yet.</p>
              <Link to="/student-dashboard" className="inline-block mt-4 px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition">
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {enrolledCourses.map((course) => {
                const progress = getProgress(course);
                const totalSections = course.sections?.length || 0;
                const totalLecs = course.sections?.reduce((a, s) => a + (s.lectures?.length || 0), 0) || 0;
                return (
                  <div key={course._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-lg hover:border-violet-200 transition-all group">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${levelColor[course.courseLevel] || "text-slate-600 bg-slate-50 border-slate-200"}`}>
                        {course.courseLevel}
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                        {course.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-800 text-base mb-1 line-clamp-1 group-hover:text-violet-700 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-xs mb-4 line-clamp-2">{course.description}</p>

                    {/* Course Stats */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                      <span className="flex items-center gap-1"><FiBook size={11} /> {totalSections} sections</span>
                      <span className="flex items-center gap-1"><FiPlay size={11} /> {totalLecs} lectures</span>
                      <span className="flex items-center gap-1"><FiStar size={11} className="text-amber-400" /> {course.rating > 0 ? course.rating.toFixed(1) : "New"}</span>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-slate-500">Progress</span>
                        <span className={`text-xs font-bold ${progress >= 70 ? "text-emerald-600" : progress >= 30 ? "text-amber-600" : "text-red-500"}`}>
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${progressColor(progress)}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5">
                        {progress < 30 ? "Just getting started" : progress < 70 ? "Keep going!" : "Almost there!"}
                      </p>
                    </div>

                    {/* CTA */}
                    <Link
                      to={`/course/${course._id}`}
                      className="mt-4 w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-violet-700 transition shadow-sm shadow-violet-100"
                    >
                      <FiPlay size={13} /> Continue Learning
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
