import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { FiStar, FiMessageSquare, FiTrendingUp, FiBookOpen } from "react-icons/fi";

export default function InstructorReviews() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/instructor-api/my-courses");
        setCourses(res.data.payload || []);
      } catch (err) {
        toast.error("Failed to load your reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Compute all reviews across all courses
  const allReviews = useMemo(() => {
    const list = [];
    courses.forEach(c => {
      if (c.reviews) {
        c.reviews.forEach(r => {
          list.push({ ...r, course: c });
        });
      }
    });
    // Sort by newest first
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [courses]);

  const averageRating = useMemo(() => {
    if (courses.length === 0) return 0;
    const ratedCourses = courses.filter(c => c.rating > 0);
    if (ratedCourses.length === 0) return 0;
    const total = ratedCourses.reduce((sum, c) => sum + c.rating, 0);
    return total / ratedCourses.length;
  }, [courses]);

  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach(r => {
      if (dist[r.rating] !== undefined) {
        dist[r.rating]++;
      }
    });
    return dist;
  }, [allReviews]);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Student Feedback</h1>
        <p className="text-slate-500">Monitor ratings and reviews across your entire curriculum.</p>
      </div>

      {allReviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm max-w-2xl mx-auto mt-12">
          <div className="w-20 h-20 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiMessageSquare size={32} />
          </div>
          <h2 className="text-xl font-bold mb-3">No reviews yet</h2>
          <p className="text-slate-500 mb-6">
            Your students haven't left any reviews yet. Keep creating great content and engaging with your students!
          </p>
          <Link 
            to="/instructor-my-courses"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            <FiBookOpen size={18} /> View My Courses
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: Stats Sticky Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <FiTrendingUp className="text-blue-500" /> Overall Engagement
              </h3>

              <div className="flex items-center gap-4 mb-8">
                <div className="text-5xl font-black text-slate-800">
                  {averageRating.toFixed(1)}
                </div>
                <div>
                  <div className="flex gap-0.5 text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <FiStar key={s} size={18} className={s <= Math.round(averageRating) ? "fill-amber-400" : "text-slate-200"} style={s <= Math.round(averageRating) ? {fill: "currentColor"} : {}} />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-slate-500">
                    Course Average
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = ratingDistribution[star];
                  const percent = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-sm font-bold w-8 shrink-0 text-slate-600">
                        {star} <FiStar className="text-amber-400 fill-amber-400" size={12} />
                      </span>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 rounded-full transition-all duration-700" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 w-6 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total Reviews</p>
                <p className="text-2xl font-black text-slate-800">{allReviews.length}</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Review Feed */}
          <div className="flex-1 space-y-4">
            <h2 className="font-bold border-b border-slate-200 pb-2 mb-4 text-slate-600 flex items-center justify-between">
              Recent Reviews
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">{allReviews.length} Total</span>
            </h2>

            {allReviews.map((rev, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col md:flex-row gap-5 hover:shadow-md transition">
                
                {/* Reviewer Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-2xl flex items-center justify-center text-lg font-bold shrink-0 shadow-inner">
                  {rev.user?.firstName ? rev.user.firstName[0] : "S"}
                </div>

                <div className="flex-1">
                  {/* Header Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-bold text-lg">
                        {rev.user?.firstName || "Student"} {rev.user?.lastName || ""}
                      </h4>
                      <Link to={`/course/${rev.course._id}`} className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full mt-1 inline-block transition">
                        {rev.course.title}
                      </Link>
                    </div>
                    
                    <div className="flex flex-col md:items-end">
                      <div className="flex items-center gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={s <= rev.rating ? "text-amber-400" : "text-slate-200"}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-medium text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric'})}
                      </span>
                    </div>
                  </div>

                  {/* Review Body */}
                  <div className="text-slate-600 bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap">
                    "{rev.review}"
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
