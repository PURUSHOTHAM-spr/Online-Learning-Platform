import { Link } from "react-router-dom";
import { FiBook, FiStar, FiUsers } from "react-icons/fi";

const levelColor = {
  Beginner:     "text-emerald-700 bg-emerald-50",
  Intermediate: "text-amber-700   bg-amber-50",
  Advanced:     "text-red-700     bg-red-50",
};

function CourseCard({ course }) {
  return (
    <Link
      to="/all-courses"
      className="flex flex-col rounded-2xl overflow-hidden border border-[#e9eaf2] hover:shadow-xl transition-all duration-300 group bg-white"
    >
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600 flex-shrink-0">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiBook size={32} className="text-white/50" />
          </div>
        )}
        {course.courseLevel && (
          <div className="absolute top-2 left-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm ${levelColor[course.courseLevel] || "text-slate-600"}`}>
              {course.courseLevel}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs font-medium text-[#6b7280] mb-1 truncate">{course.category}</p>
        <h3 className="font-bold text-[#1c1d1f] text-sm line-clamp-2 leading-snug mb-2 group-hover:text-violet-700 transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-[#6b7280] line-clamp-2 flex-1 mb-3">
          {course.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-[#9ca3af] border-t border-[#f2f3f5] pt-3">
          <span className="flex items-center gap-1">
            <FiStar size={11} className="text-amber-400" />
            {course.rating > 0 ? course.rating.toFixed(1) : "New"}
          </span>
          <span className="flex items-center gap-1">
            <FiUsers size={11} />
            {course.studentsEnrolled || 0} students
          </span>
          <span className="flex items-center gap-1">
            <FiBook size={11} />
            {course.sections?.length || 0} sections
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;