import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { FiStar, FiMessageSquare, FiTrendingUp, FiBookOpen, FiUsers } from "react-icons/fi";

export default function InstructorReviews() {
  const [analyticsData, setAnalyticsData] = useState({
    reviews: [],
    globalAverageCompletion: 0,
    totalActiveLearners: 0,
    totalEnrolled: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosInstance.get("/instructor-api/global-reviews-analytics");
        setAnalyticsData(res.data.payload);
      } catch (err) {
        toast.error("Failed to load your reviews and analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const allReviews = analyticsData.reviews;

  const averageRating = useMemo(() => {
    if (allReviews.length === 0) return 0;
    const total = allReviews.reduce((sum, r) => sum + r.rating, 0);
    return total / allReviews.length;
  }, [allReviews]);

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
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            
            {/* Rating Stats */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <FiStar className="text-amber-500 fill-amber-500" /> Overall Rating
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

            {/* Global Engagement Stats */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
              
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
                <FiTrendingUp className="text-indigo-400" /> Global Engagement
              </h3>

              <div className="space-y-6 relative z-10">
                <div>
                  <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Avg Completion Rate</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black">{analyticsData.globalAverageCompletion}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-indigo-950 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${analyticsData.globalAverageCompletion}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-indigo-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-800/50 flex items-center justify-center text-indigo-300">
                      <FiUsers size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Active Learners</p>
                      <p className="font-bold">{analyticsData.totalActiveLearners} <span className="text-xs font-normal text-indigo-400">/ {analyticsData.totalEnrolled} total</span></p>
                    </div>
                  </div>
                </div>
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
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        {rev.user?.firstName || "Student"} {rev.user?.lastName || ""}
                      </h4>
                      <Link to={`/course/${rev.course._id}`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full mt-1.5 inline-block transition border border-indigo-100">
                        {rev.course.title}
                      </Link>
                    </div>
                    
                    <div className="flex flex-col md:items-end gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={s <= rev.rating ? "text-amber-400" : "text-slate-200"}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric'})}
                      </span>
                    </div>
                  </div>

                  {/* Student Engagement Progress Bar */}
                  {rev.studentCompletionPct !== undefined && (
                    <div className="mb-4 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Course Completion</span>
                          <span className="text-[10px] font-black text-indigo-600">{rev.studentCompletionPct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ${
                              rev.studentCompletionPct > 80 ? 'bg-emerald-500' :
                              rev.studentCompletionPct > 40 ? 'bg-indigo-500' : 'bg-slate-400'
                            }`}
                            style={{ width: `${rev.studentCompletionPct}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {rev.studentCompletionPct > 80 ? "Highly Engaged 🌟" :
                         rev.studentCompletionPct > 40 ? "Active Learner 📚" : "Just Started 🌱"}
                      </div>
                    </div>
                  )}

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
