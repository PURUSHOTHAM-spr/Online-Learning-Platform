import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { 
  FiArrowLeft, FiEdit3, FiUsers, FiStar, FiBook, 
  FiPlay, FiCheckCircle, FiCopy 
} from "react-icons/fi";

const levelColor = {
  Beginner:     "text-emerald-700 bg-emerald-50 border-emerald-200",
  Intermediate: "text-amber-700   bg-amber-50   border-amber-200",
  Advanced:     "text-red-700     bg-red-50     border-red-200",
};

export default function InstructorCourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Use the existing user-api endpoint as it fetches full course details
        // Or if there's a specific instructor endpoint, use that.
        // We'll use user-api/course/:id since it returns everything we need.
        const res = await axiosInstance.get(`/user-api/course/${courseId}`);
        setCourse(res.data.payload);
      } catch (err) {
        toast.error("Failed to load course details.");
        navigate("/instructor-my-courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) return null;

  const totalLectures = course.sections?.reduce((acc, sec) => acc + (sec.lectures?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      
      {/* ── HEADER BANNERS ── */}
      <div className="bg-white border-b border-slate-200 px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-20">
        <button 
          onClick={() => navigate("/instructor-my-courses")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <FiArrowLeft size={18} /> Back to Courses
        </button>
        <div className="flex gap-3">
          {/* We'll link to an edit page or just open a modal later */}
          <Link 
            to={`/instructor/course/${course._id}/edit`}
            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition border border-blue-200 text-sm"
          >
            <FiEdit3 size={16} /> Edit Course
          </Link>
          <Link 
            to={`/course/${course._id}`} // Link to the public page
            target="_blank"
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-900 transition text-sm"
          >
            Preview as Student
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 mt-8">
        
        {/* ── COURSE HERO INFO ── */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 mb-8 relative overflow-hidden">
          
          {/* Status Badge */}
          {course.isActive ? (
             <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-sm flex items-center gap-1">
               <FiCheckCircle size={12} /> PUBLISHED
             </div>
          ) : (
            <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-sm">
               DRAFT
             </div>
          )}

          {/* Thumbnail */}
          <div className="w-full md:w-80 h-48 bg-slate-100 rounded-2xl overflow-hidden shrink-0 shadow-inner">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-100 to-slate-200">
                <FiBook size={32} className="mb-2" />
                <span className="text-xs font-medium">No cover image</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${levelColor[course.courseLevel] || 'bg-slate-100 text-slate-600'}`}>
                {course.courseLevel}
              </span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                {course.category}
              </span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                ₹{course.price}
              </span>
            </div>
            
            <h1 className="text-3xl font-extrabold mb-3 leading-tight text-slate-800">
              {course.title}
            </h1>
            
            <p className="text-slate-600 mb-6 line-clamp-2">
              {course.description}
            </p>

            {/* Metrics */}
            <div className="flex flex-wrap gap-6 mt-auto">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FiUsers size={16} /></div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Students</p>
                  <p className="font-bold text-slate-700">{course.studentsEnrolled || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><FiStar size={16} /></div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Rating</p>
                  <p className="font-bold text-slate-700">{course.rating > 0 ? course.rating.toFixed(1) : '—'} <span className="text-xs font-normal">({course.reviews?.length || 0})</span></p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FiPlay size={16} /></div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Content</p>
                  <p className="font-bold text-slate-700">{course.sections?.length || 0} Sec / {totalLectures} Lec</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Curriculum Preview & Info */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Curriculum Setup</h3>
                <Link to={`/instructor/course/${course._id}/edit`} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
                  Manage Curriculum →
                </Link>
              </div>

              {course.sections?.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-500">
                  <FiBook size={32} className="mx-auto mb-3 text-slate-300" />
                  <p className="font-medium text-sm">No sections added yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {course.sections.map((section, idx) => (
                    <div key={section._id} className="border border-slate-200 rounded-2xl overflow-hidden">
                      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-700">Section {idx + 1}: {section.sectionTitle}</span>
                        <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">{section.lectures?.length || 0} lectures</span>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {section.lectures?.map((lec, lIdx) => (
                          <div key={lec._id} className="px-5 py-3 flex items-center gap-3 bg-white hover:bg-slate-50/50 transition">
                            <FiPlay size={14} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-600 flex-1">{lec.title}</span>
                            {lec.isPreview && (
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Preview</span>
                            )}
                          </div>
                        ))}
                        {section.lectures?.length === 0 && (
                          <div className="px-5 py-3 text-xs text-slate-400 italic">No lectures in this section.</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Course Outcomes</h3>
              <ul className="space-y-3">
                {course.courseOutcomes?.map((outcome, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-600">
                    <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Quick Actions</h3>
              <div className="space-y-3">
                <Link to={`/instructor/course/${course._id}/edit`} className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-semibold text-sm transition">
                  <FiEdit3 size={16} /> Edit Basic Info
                </Link>
                <Link to={`/instructor/course/${course._id}/edit`} className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-semibold text-sm transition">
                  <FiPlay size={16} /> Add / Manage Videos
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-sm transition" onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/course/${course._id}`);
                  toast.success("Public course link copied!");
                }}>
                  <FiCopy size={16} /> Copy Public Link
                </button>
              </div>
            </div>

            {/* Welcome msg */}
            {course.welcomeMessage && (
              <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 shadow-sm">
                <h3 className="font-bold text-emerald-800 mb-2 text-sm">Welcome Message</h3>
                <p className="text-sm text-emerald-700 italic">"{course.welcomeMessage}"</p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
