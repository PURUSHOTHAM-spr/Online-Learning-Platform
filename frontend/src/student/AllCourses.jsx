import { useState, useEffect } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiSearch, FiBook, FiStar, FiClock, FiPlay,
  FiFilter, FiX, FiUsers, FiGrid, FiList
} from "react-icons/fi";

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

const levelColor = {
  Beginner:     "text-emerald-700 bg-emerald-50 border-emerald-200",
  Intermediate: "text-amber-700   bg-amber-50   border-amber-200",
  Advanced:     "text-red-700     bg-red-50     border-red-200",
};

function AllCourses() {
  const [allCourses,    setAllCourses]    = useState([]);
  const [enrolled,      setEnrolled]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [enrollingId,   setEnrollingId]   = useState(null);
  const [search,        setSearch]        = useState("");
  const [levelFilter,   setLevelFilter]   = useState("All");
  const [categoryFilter,setCategoryFilter]= useState("All");
  const [viewMode,      setViewMode]      = useState("grid"); // "grid" | "list"
  const [sortBy,        setSortBy]        = useState("newest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, enrolledRes] = await Promise.all([
          axiosInstance.get("/user-api/courses"),
          axiosInstance.get("/user-api/my-courses"),
        ]);
        setAllCourses(allRes.data.payload || []);
        setEnrolled((enrolledRes.data.payload || []).map(c => c._id));
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
      setEnrolled(prev => [...prev, courseId]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed.");
    } finally {
      setEnrollingId(null);
    }
  };

  const isEnrolled = (id) => enrolled.includes(id);

  // Unique categories from courses
  const categories = ["All", ...new Set(allCourses.map(c => c.category).filter(Boolean))];

  const filtered = allCourses
    .filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        c.title.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q);
      const matchLevel    = levelFilter    === "All" || c.courseLevel === levelFilter;
      const matchCategory = categoryFilter === "All" || c.category    === categoryFilter;
      return matchSearch && matchLevel && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === "newest")    return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "popular")   return (b.studentsEnrolled || 0) - (a.studentsEnrolled || 0);
      if (sortBy === "rating")    return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const resetFilters = () => {
    setSearch(""); setLevelFilter("All"); setCategoryFilter("All"); setSortBy("newest");
  };

  const hasActiveFilters = search || levelFilter !== "All" || categoryFilter !== "All" || sortBy !== "newest";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ── HERO HEADER ── */}
      <div className="bg-gradient-to-r from-violet-700 to-indigo-600 px-8 py-12 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-violet-200 text-sm font-medium mb-2">Explore</p>
          <h1 className="text-4xl font-bold mb-2">All Courses</h1>
          <p className="text-violet-200 mb-8">
            {allCourses.length} courses available — find your next skill
          </p>

          {/* Search bar inside hero */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 shadow-lg max-w-xl">
            <FiSearch className="text-slate-400 shrink-0" size={20} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, category, or keyword..."
              className="w-full outline-none text-sm text-slate-700 placeholder-slate-400 bg-transparent"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── SIDEBAR FILTERS ── */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">

            {/* Active filters header */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                  <FiFilter size={14} /> Active Filters
                </span>
                <button onClick={resetFilters} className="text-xs font-semibold text-violet-600 hover:underline">
                  Clear all
                </button>
              </div>
            )}

            {/* Level Filter */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Level</h3>
              <div className="space-y-2">
                {LEVELS.map(l => (
                  <button
                    key={l}
                    onClick={() => setLevelFilter(l)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl transition font-medium ${
                      levelFilter === l
                        ? "bg-violet-600 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Category</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl transition font-medium ${
                      categoryFilter === cat
                        ? "bg-violet-600 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-700">{filtered.length}</span> of {allCourses.length} courses
              </p>
              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-sm border border-slate-200 rounded-xl px-3 py-2 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
                {/* View Toggle */}
                <div className="flex border border-slate-200 bg-white rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-2 transition ${viewMode === "grid" ? "bg-violet-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                    title="Grid view"
                  >
                    <FiGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2 transition ${viewMode === "list" ? "bg-violet-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                    title="List view"
                  >
                    <FiList size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                <FiSearch size={40} className="text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-600 mb-2">No courses found</h2>
                <p className="text-slate-400 text-sm mb-5">Try clearing your filters or searching for something else.</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(course => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    isEnrolled={isEnrolled(course._id)}
                    onEnroll={handleEnroll}
                    enrollingId={enrollingId}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(course => (
                  <CourseListRow
                    key={course._id}
                    course={course}
                    isEnrolled={isEnrolled(course._id)}
                    onEnroll={handleEnroll}
                    enrollingId={enrollingId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Grid Card ─────────────────────────────────────────── */
function CourseCard({ course, isEnrolled, onEnroll, enrollingId }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
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
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border ${levelColor[course.courseLevel] || "text-slate-600"}`}>
            {course.courseLevel}
          </span>
        </div>
        {isEnrolled && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white">
              Enrolled ✓
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-slate-400 font-medium mb-1">{course.category}</p>
        <h3 className="font-bold text-slate-800 text-base mb-2 line-clamp-2 group-hover:text-violet-700 transition-colors">
          {course.title}
        </h3>
        <p className="text-slate-500 text-xs line-clamp-2 mb-4 flex-1">{course.description}</p>

        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4 border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1"><FiBook size={11} /> {course.sections?.length || 0} sections</span>
          <span className="flex items-center gap-1"><FiStar size={11} className="text-amber-400" /> {course.rating > 0 ? course.rating.toFixed(1) : "New"}</span>
          <span className="flex items-center gap-1"><FiUsers size={11} /> {course.studentsEnrolled || 0}</span>
        </div>

        {isEnrolled ? (
          <Link
            to={`/course/${course._id}`}
            className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold text-center flex items-center justify-center gap-2 hover:bg-violet-700 transition"
          >
            <FiPlay size={13} /> Continue
          </Link>
        ) : (
          <button
            onClick={() => onEnroll(course._id)}
            disabled={enrollingId === course._id}
            className="w-full py-2.5 rounded-xl border-2 border-violet-500 text-violet-600 text-sm font-bold hover:bg-violet-600 hover:text-white transition disabled:opacity-50"
          >
            {enrollingId === course._id ? "Enrolling..." : "Enroll Free"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── List Row ───────────────────────────────────────────── */
function CourseListRow({ course, isEnrolled, onEnroll, enrollingId }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 transition-all overflow-hidden flex gap-0 group">
      {/* Thumbnail */}
      <div className="w-48 shrink-0 relative overflow-hidden">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-500 min-h-[130px]">
            <FiBook size={28} className="text-white/50" />
          </div>
        )}
      </div>

      <div className="flex flex-1 items-center p-5 gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${levelColor[course.courseLevel] || "text-slate-600 bg-slate-100"}`}>
              {course.courseLevel}
            </span>
            <span className="text-xs text-slate-400">{course.category}</span>
            {isEnrolled && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                Enrolled ✓
              </span>
            )}
          </div>
          <h3 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-violet-700 transition-colors mb-1">{course.title}</h3>
          <p className="text-slate-500 text-xs line-clamp-2">{course.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1"><FiBook size={11} /> {course.sections?.length || 0} sections</span>
            <span className="flex items-center gap-1"><FiStar size={11} className="text-amber-400" /> {course.rating > 0 ? course.rating.toFixed(1) : "New"}</span>
            <span className="flex items-center gap-1"><FiClock size={11} /> {course.studentsEnrolled || 0} students</span>
          </div>
        </div>

        <div className="shrink-0">
          {isEnrolled ? (
            <Link
              to={`/course/${course._id}`}
              className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold flex items-center gap-2 hover:bg-violet-700 transition"
            >
              <FiPlay size={13} /> Continue
            </Link>
          ) : (
            <button
              onClick={() => onEnroll(course._id)}
              disabled={enrollingId === course._id}
              className="px-5 py-2.5 rounded-xl border-2 border-violet-500 text-violet-600 text-sm font-bold hover:bg-violet-600 hover:text-white transition disabled:opacity-50"
            >
              {enrollingId === course._id ? "Enrolling..." : "Enroll Free"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllCourses;