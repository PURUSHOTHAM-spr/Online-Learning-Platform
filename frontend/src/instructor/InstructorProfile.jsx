import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import {
  FiUser, FiMail, FiBookOpen, FiCalendar, FiCheckCircle,
  FiStar, FiUsers, FiDollarSign, FiTrendingUp, FiPlus,
  FiEdit3, FiBarChart2, FiPlay, FiAward, FiLayers
} from "react-icons/fi";

// ── helpers ─────────────────────────────────────────────
const levelColor = {
  Beginner:     "text-emerald-700 bg-emerald-50 border-emerald-200",
  Intermediate: "text-amber-700 bg-amber-50 border-amber-200",
  Advanced:     "text-red-700 bg-red-50 border-red-200",
};

const StarRating = ({ rating }) => {
  const filled = Math.round(rating);
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <FiStar
          key={i}
          size={11}
          className={i <= filled ? "text-amber-400 fill-amber-400" : "text-slate-300"}
        />
      ))}
    </span>
  );
};

// ── Main Component ───────────────────────────────────────
function InstructorProfile() {
  const [profile, setProfile]   = useState(null);
  const [courses, setCourses]   = useState([]);
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, coursesRes, statsRes] = await Promise.all([
          axiosInstance.get("/user-api/profile"),
          axiosInstance.get("/instructor-api/my-courses"),
          axiosInstance.get("/instructor-api/dashboard-stats"),
        ]);
        setProfile(profileRes.data.payload);
        setCourses(coursesRes.data.payload || []);
        setStats(statsRes.data.payload?.stats || null);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
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

  const initials = `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();
  const joinedDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const totalLectures = courses.reduce(
    (acc, c) => acc + (c.sections?.reduce((a, s) => a + (s.lectures?.length || 0), 0) || 0), 0
  );
  const totalSections = courses.reduce((acc, c) => acc + (c.sections?.length || 0), 0);

  const formattedRevenue = stats?.totalRevenue >= 1000
    ? `₹${(stats.totalRevenue / 1000).toFixed(1)}K`
    : `₹${stats?.totalRevenue ?? 0}`;

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ── HERO BANNER ──────────────────────────── */}
      <div className="h-56 bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 relative overflow-hidden">
        {/* Decorative dot grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(white 1.5px, transparent 1.5px)", backgroundSize: "30px 30px" }}
        />
        {/* Floating geometric accents */}
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-24 bg-indigo-900/20 blur-2xl" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-900/30 to-transparent" />

        {/* Instructor badge overlay */}
        <div className="absolute top-6 right-8 flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
          <FiAward size={14} className="text-amber-300" />
          <span className="text-xs font-semibold text-white">Instructor</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24">

        {/* ── PROFILE HEADER CARD ──────────────────── */}
        <div className="bg-white rounded-3xl shadow-xl -mt-20 relative z-10 overflow-hidden">
          {/* Subtle inner accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

          <div className="px-8 pt-8 pb-8 flex items-start gap-6 flex-wrap">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white text-4xl font-black shadow-2xl -mt-2 ring-4 ring-white flex-shrink-0">
              {initials}
            </div>

            {/* Name & Info */}
            <div className="flex-1 min-w-0 pt-2">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl font-extrabold text-slate-800">
                  {profile.firstName} {profile.lastName}
                </h1>
                <span className="text-xs font-bold px-3 py-1 rounded-full border text-blue-700 bg-blue-100 border-blue-200">
                  Instructor
                </span>
                {profile.isActive && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <FiCheckCircle size={11} /> Active
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm mb-4 flex items-center gap-1.5">
                <FiMail size={13} className="text-slate-400" /> {profile.email}
              </p>

              {/* Quick Stats Strip */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: <FiBookOpen size={15} />, label: "Courses",  value: courses.length },
                  { icon: <FiUsers size={15} />,    label: "Students", value: (stats?.totalStudents ?? 0).toLocaleString() },
                  { icon: <FiLayers size={15} />,   label: "Lectures", value: totalLectures },
                  { icon: <FiCalendar size={15} />, label: "Joined",   value: joinedDate },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-500">
                    <span className="text-blue-500">{s.icon}</span>
                    <span className="text-sm">
                      <span className="font-bold text-slate-700">{s.value}</span> {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to="/create-course"
              id="instructor-profile-create-course"
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200 self-start mt-2"
            >
              <FiPlus size={16} /> New Course
            </Link>
          </div>
        </div>

        {/* ── STATS CARDS ──────────────────────────── */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <FiUsers size={18} className="text-blue-600" />,
              bg: "bg-blue-50 border-blue-100",
              iconBg: "bg-blue-100",
              label: "Total Students",
              value: (stats?.totalStudents ?? 0).toLocaleString(),
            },
            {
              icon: <FiDollarSign size={18} className="text-emerald-600" />,
              bg: "bg-emerald-50 border-emerald-100",
              iconBg: "bg-emerald-100",
              label: "Total Revenue",
              value: formattedRevenue,
            },
            {
              icon: <FiStar size={18} className="text-amber-500" />,
              bg: "bg-amber-50 border-amber-100",
              iconBg: "bg-amber-100",
              label: "Avg. Rating",
              value: stats?.averageRating ?? "0.0",
            },
            {
              icon: <FiBookOpen size={18} className="text-violet-600" />,
              bg: "bg-violet-50 border-violet-100",
              iconBg: "bg-violet-100",
              label: "Active Courses",
              value: stats?.activeCount ?? 0,
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`${card.bg} border rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5`}
            >
              <div className={`w-11 h-11 ${card.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                {card.icon}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{card.label}</p>
                <p className="text-xl font-bold text-slate-800 mt-0.5">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── DETAIL INFO STRIP ────────────────────── */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <FiUser size={18} className="text-blue-500" />,     label: "Full Name",     value: `${profile.firstName} ${profile.lastName}` },
            { icon: <FiMail size={18} className="text-blue-500" />,     label: "Email",         value: profile.email },
            { icon: <FiLayers size={18} className="text-blue-500" />,   label: "Sections",      value: `${totalSections} sections` },
            { icon: <FiCalendar size={18} className="text-blue-500" />, label: "Member Since",  value: joinedDate },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                <p className="text-sm font-bold text-slate-700 truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── COURSE PORTFOLIO ─────────────────────── */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">My Course Portfolio</h2>
              <p className="text-sm text-slate-400 mt-0.5">All courses you've published on the platform</p>
            </div>
            <Link
              to="/instructor-my-courses"
              className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              Manage All <FiBookOpen size={14} />
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="bg-white rounded-3xl p-14 text-center shadow-sm border border-slate-100">
              <div className="w-20 h-20 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBookOpen size={36} />
              </div>
              <p className="text-slate-600 font-semibold text-lg mb-1">No courses yet</p>
              <p className="text-slate-400 text-sm mb-6">
                Share your expertise by creating your first course.
              </p>
              <Link
                to="/create-course"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                <FiPlus size={15} /> Create Course
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {courses.map((course) => {
                const totalLecs = course.sections?.reduce((a, s) => a + (s.lectures?.length || 0), 0) || 0;
                const totalSecs = course.sections?.length || 0;

                return (
                  <div
                    key={course._id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all group"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-36 bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiBookOpen size={32} className="text-white/40" />
                        </div>
                      )}
                      {/* Badges */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md border ${levelColor[course.courseLevel] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                          {course.courseLevel}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${course.isActive ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"}`}>
                          {course.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                          ₹{course.price}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="mb-1">
                        <span className="text-xs text-slate-400 font-medium">{course.category}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-base mb-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-slate-500 text-xs mb-4 line-clamp-2">{course.description}</p>

                      {/* Course meta row */}
                      <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                        <span className="flex items-center gap-1">
                          <FiLayers size={11} /> {totalSecs} sections
                        </span>
                        <span className="flex items-center gap-1">
                          <FiPlay size={11} /> {totalLecs} lectures
                        </span>
                        <span className="flex items-center gap-1">
                          <FiUsers size={11} /> {course.studentsEnrolled || 0} students
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <StarRating rating={course.rating || 0} />
                        <span className="text-xs font-bold text-amber-600">
                          {course.rating > 0 ? course.rating.toFixed(1) : "No rating"}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({course.reviews?.length || 0} reviews)
                        </span>
                      </div>

                      {/* Enrollment bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-semibold text-slate-500">Enrollment</span>
                          <span className="text-xs font-bold text-blue-600">
                            {course.studentsEnrolled || 0} students
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                            style={{
                              width: `${Math.min(((course.studentsEnrolled || 0) / Math.max(...courses.map(c => c.studentsEnrolled || 1), 1)) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                        <Link
                          to={`/instructor/course/${course._id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                        >
                          <FiEdit3 size={13} /> Manage
                        </Link>
                        <div className="w-px h-4 bg-slate-200" />
                        <Link
                          to={`/instructor/course/${course._id}/analytics`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition"
                        >
                          <FiBarChart2 size={13} /> Analytics
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── QUICK ACTIONS BAR ───────────────────── */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl shadow-blue-200">
          <div className="text-white">
            <p className="font-bold text-lg">Ready to grow your reach?</p>
            <p className="text-blue-100 text-sm mt-0.5">Create a new course and share your knowledge with the world.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/instructor-dashboard"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur text-white rounded-xl text-sm font-semibold hover:bg-white/25 transition border border-white/20"
            >
              <FiTrendingUp size={15} /> Dashboard
            </Link>
            <Link
              to="/create-course"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-50 transition shadow-lg"
            >
              <FiPlus size={15} /> Create Course
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default InstructorProfile;
