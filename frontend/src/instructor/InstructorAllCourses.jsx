import { useState, useEffect } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { Link } from "react-router-dom";
import {
  FiSearch, FiBook, FiStar, FiClock,
  FiFilter, FiX, FiUsers, FiGrid, FiList
} from "react-icons/fi";

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

const levelColor = {
  Beginner:     "text-emerald-700 bg-emerald-50 border-emerald-200",
  Intermediate: "text-amber-700   bg-amber-50   border-amber-200",
  Advanced:     "text-red-700     bg-red-50     border-red-200",
};

function InstructorAllCourses() {
  const [allCourses,    setAllCourses]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [levelFilter,   setLevelFilter]   = useState("All");
  const [categoryFilter,setCategoryFilter]= useState("All");
  const [viewMode,      setViewMode]      = useState("grid"); // "grid" | "list"
  const [sortBy,        setSortBy]        = useState("newest");
  
  // Also get instructor's own courses so we can badge them separately
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, myRes] = await Promise.all([
          axiosInstance.get("/user-api/courses"),
          axiosInstance.get("/instructor-api/my-courses")
        ]);
        setAllCourses(allRes.data.payload || []);
        setMyCourses((myRes.data.payload || []).map(c => c._id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isMyCourse = (id) => myCourses.includes(id);

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
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading platform courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">

      {/* ── HERO HEADER ── */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-600 px-8 py-12 text-white shadow-md">
        <div className="max-w-7xl mx-auto">
          <p className="text-blue-200 tracking-wider text-xs font-bold uppercase mb-2">Platform Catalog</p>
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">All Courses Directory</h1>
          <p className="text-blue-100 mb-8 max-w-xl text-lg">
            Browse {allCourses.length} courses across the platform. Find inspiration and discover what's engaging students right now.
          </p>

          <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 shadow-xl max-w-xl">
            <FiSearch className="text-slate-400 shrink-0" size={20} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, category, or keyword..."
              className="w-full outline-none text-base text-slate-700 placeholder-slate-400 bg-transparent font-medium"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full transition-colors">
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── SIDEBAR FILTERS ── */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">

            {hasActiveFilters && (
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <FiFilter size={14} /> Active Filters
                </span>
                <button onClick={resetFilters} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  Clear all
                </button>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Level</h3>
              <div className="flex flex-col gap-1.5">
                {LEVELS.map(l => (
                  <button
                    key={l}
                    onClick={() => setLevelFilter(l)}
                    className={`text-left text-sm px-4 py-2.5 rounded-xl transition-all font-semibold ${
                      levelFilter === l
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Category</h3>
              <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`text-left text-sm px-4 py-2.5 rounded-xl transition-all font-semibold ${
                      categoryFilter === cat
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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

            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 font-medium px-2">
                Showing <span className="font-extrabold text-slate-800">{filtered.length}</span> matching courses
              </p>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-sm font-bold border-2 border-slate-100 rounded-xl px-4 py-2.5 text-slate-600 bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all cursor-pointer appearance-none pr-10 relative"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 24 24\\\' fill=\\\'none\\\' stroke=\\\'currentColor\\\' stroke-width=\\\'2\\\' stroke-linecap=\\\'round\\\' stroke-linejoin=\\\'round\\\'%3e%3cpolyline points=\\\'6 9 12 15 18 9\\\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                >
                  <option value="newest">Newest Listed</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-all rounded-lg ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-700"}`}
                    title="Grid view"
                  >
                    <FiGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-all rounded-lg ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-700"}`}
                    title="List view"
                  >
                    <FiList size={16} />
                  </button>
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="bg-slate-50 p-6 rounded-full mb-6">
                  <FiSearch size={48} className="text-slate-300" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-800 mb-2">No results found</h2>
                <p className="text-slate-500 text-base mb-8 max-w-sm">We couldn't find any courses matching your specific filters and search term.</p>
                <button
                  onClick={resetFilters}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(course => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    isMyCourse={isMyCourse(course._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(course => (
                  <CourseListRow
                    key={course._id}
                    course={course}
                    isMyCourse={isMyCourse(course._id)}
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

function CourseCard({ course, isMyCourse }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-200 transition-all duration-300 overflow-hidden flex flex-col group relative">
      <div className="relative h-48 overflow-hidden flex-shrink-0 bg-slate-100">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
            <FiBook size={48} className="text-white/30" />
          </div>
        )}
        <div className="absolute top-4 left-4 flex flex-col gap-2 relative z-10">
          <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm text-slate-700 border border-white/50 inline-block w-max`}>
            {course.courseLevel}
          </span>
        </div>
        
        {/* Author badge */}
        {isMyCourse && (
          <div className="absolute top-4 right-4 z-10">
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-blue-600 text-white shadow-md border border-blue-500">
              Your Course
            </span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6 flex flex-col flex-1 bg-white relative">
        <div className="flex justify-between items-start mb-2 gap-4">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded inline-block">{course.category}</p>
        </div>
        
        <h3 className="font-extrabold text-slate-800 text-lg mb-3 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1 font-medium">{course.description}</p>

        <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1.5 rounded-lg"><FiBook size={14} className="text-slate-400" /> {course.sections?.length || 0} SECTIONS</div>
          <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1.5 rounded-lg"><FiStar size={14} className="text-amber-500" /> {course.rating > 0 ? course.rating.toFixed(1) : "NEW"}</div>
          <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1.5 rounded-lg text-emerald-700"><FiUsers size={14} /> {course.studentsEnrolled || 0}</div>
        </div>
        
        {isMyCourse && (
          <div className="mt-4 pt-4 border-t border-slate-100 border-dashed">
            <Link 
              to={`/instructor/course/${course._id}`}
              className="block w-full text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors"
            >
              Manage Course Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseListRow({ course, isMyCourse }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-lg border border-slate-200 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group h-auto sm:h-48 relative">
      <div className="w-full sm:w-64 h-48 sm:h-full shrink-0 relative overflow-hidden bg-slate-100">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
            <FiBook size={36} className="text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <div className="flex flex-1 flex-col justify-center p-6 gap-2">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 text-slate-700`}>
            {course.courseLevel}
          </span>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{course.category}</span>
          {isMyCourse && (
             <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700 ml-auto sm:ml-0">
               Your Course
             </span>
          )}
        </div>
        
        <h3 className="font-extrabold text-slate-800 text-xl line-clamp-1 group-hover:text-blue-700 transition-colors">{course.title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 max-w-3xl font-medium">{course.description}</p>
        
        <div className="flex items-center gap-6 mt-3 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5"><FiBook size={14} className="text-slate-400" /> {course.sections?.length || 0} SECTIONS</span>
          <span className="flex items-center gap-1.5"><FiStar size={14} className="text-amber-500" /> {course.rating > 0 ? course.rating.toFixed(1) : "NEW"}</span>
          <span className="flex items-center gap-1.5"><FiClock size={14} className="text-slate-400" /> {course.studentsEnrolled || 0} STUDENTS</span>
        </div>
      </div>
      
      {isMyCourse && (
        <div className="hidden lg:flex items-center justify-center p-6 border-l border-slate-100 border-dashed bg-slate-50/50">
          <Link 
            to={`/instructor/course/${course._id}`}
            className="px-6 py-3 bg-white border border-slate-200 shadow-sm hover:border-blue-400 hover:text-blue-600 text-slate-700 text-sm font-bold rounded-xl transition-all whitespace-nowrap"
          >
            Manage Course
          </Link>
        </div>
      )}
    </div>
  );
}

export default InstructorAllCourses;
