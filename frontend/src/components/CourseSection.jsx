import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import CourseCard from "./CourseCard";
import { FiChevronRight } from "react-icons/fi";

function CoursesSection() {
  const [courses, setCourses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/user-api/courses");
        setCourses(res.data.payload || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Derive categories dynamically from fetched courses
  const categories = ["All", ...new Set(courses.map(c => c.category).filter(Boolean))];

  const filtered = activeCategory === "All"
    ? courses
    : courses.filter(c => c.category === activeCategory);

  return (
    <section className="mt-16">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#1c1d1f]">
            Learners are viewing
          </h2>
          <p className="mt-2 text-[#4d5156]">
            Most popular picks based on enrollments and outcomes this week.
          </p>
        </div>

        <Link
          to='/instructor-all-courses'
          className="w-fit flex items-center gap-1 rounded border border-[#1c1d1f] px-4 py-2 text-sm font-bold text-[#1c1d1f] transition hover:bg-[#f7f9fa]"
        >
          Show all courses <FiChevronRight size={15} />
        </Link>
      </div>

      {/* Category Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeCategory === category
                ? "bg-[#1c1d1f] text-white"
                : "bg-[#f2f3f5] text-[#2d2f31] hover:bg-[#e7e9eb]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading skeltons */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-2xl overflow-hidden shadow animate-pulse">
              <div className="h-40 bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-[#6b7280]">
          <p className="text-lg font-semibold">No courses available yet.</p>
          <p className="mt-1 text-sm">Check back soon — instructors are creating content!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.slice(0, 8).map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}

export default CoursesSection;