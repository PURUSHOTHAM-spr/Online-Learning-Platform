import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { FiArrowLeft, FiTrendingUp, FiUsers, FiBarChart2, FiAward, FiClock } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

export default function InstructorAnalytics() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, analyticsRes] = await Promise.all([
          axiosInstance.get(`/instructor-api/course/${courseId}`),
          axiosInstance.get(`/instructor-api/analytics/${courseId}`)
        ]);
        
        setCourse(courseRes.data.payload);
        setAnalytics(analyticsRes.data.payload);
      } catch (err) {
        toast.error("Failed to load analytics");
        navigate(`/instructor/course/${courseId}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course || !analytics) return null;

  // Custom Tooltip for the Rechart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl shadow-xl">
          <p className="font-bold text-sm mb-1">{data.title}</p>
          <p className="text-slate-300 text-xs">Completed by: <span className="font-bold text-white">{data.completedBy} students</span></p>
          <p className="text-indigo-300 text-xs">Completion Rate: <span className="font-bold text-indigo-100">{data.completionRate}%</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      
      {/* ── TOP NAV BAR ── */}
      <div className="bg-white border-b border-slate-200 px-6 lg:px-12 py-4 flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-30 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <Link 
            to={`/instructor/course/${courseId}`}
            className="flex items-center justify-center w-10 h-10 bg-slate-50 text-slate-500 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-200"
            title="Back to Course Details"
          >
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest bg-indigo-50 inline-block px-2 py-0.5 rounded shadow-sm mb-1">Analytics Engine</p>
            <h1 className="font-extrabold text-xl leading-tight line-clamp-1">{course.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-8 space-y-8">
        
        {/* ── KEY METRICS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-indigo-200 transition">
            <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <FiTrendingUp size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Avg. Completion</p>
              <h2 className="text-3xl font-black text-slate-800">{analytics.averageCompletionRate}%</h2>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-blue-200 transition">
            <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <FiUsers size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Enrolled</p>
              <h2 className="text-3xl font-black text-slate-800">{analytics.totalEnrolled}</h2>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition">
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <FiBarChart2 size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Active Learners</p>
              <h2 className="text-3xl font-black text-slate-800">{analytics.totalActiveProgress}</h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Students with progress</p>
            </div>
          </div>

        </div>

        {/* ── MAIN DASHBOARD SPLIT ── */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LECTURE DROP-OFF CHART */}
          <div className="flex-1 bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-sm">
            <div className="mb-8 border-b border-slate-100 pb-5">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <FiBarChart2 className="text-indigo-500" /> Lecture Retention
              </h2>
              <p className="text-slate-500 mt-1 font-medium">See the percentage of students who complete each lecture to identify where engagement drops.</p>
            </div>

            {analytics.lectureDropOffs.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-500 font-medium">
                Not enough data to calculate retention yet.
              </div>
            ) : (
              <div className="h-80 w-full mt-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.lectureDropOffs} maxBarSize={40} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="index" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                      domain={[0, 100]}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                    <Bar dataKey="completionRate" radius={[6, 6, 0, 0]}>
                      {analytics.lectureDropOffs.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.completionRate > 70 ? '#4F46E5' : entry.completionRate > 40 ? '#818CF8' : '#C7D2FE'} 
                          className="transition-all duration-300 hover:opacity-80"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* STUDENT LEADERBOARD */}
          <div className="w-full lg:w-96 shrink-0 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="mb-6 border-b border-slate-100 pb-5">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FiAward className="text-amber-500" /> Top Students
              </h2>
              <p className="text-slate-500 mt-1 text-sm font-medium">Most engaged learners</p>
            </div>

            <div className="space-y-4">
              {analytics.topStudents.length === 0 ? (
                <div className="text-center py-6 text-slate-400 font-medium text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No student progress recorded.
                </div>
              ) : (
                analytics.topStudents.map((student, idx) => (
                  <div key={student.user._id || idx} className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
                    <div className="relative">
                      {student.user.profilePic ? (
                        <img src={student.user.profilePic} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-blue-200 text-indigo-700 font-black flex items-center justify-center border-2 border-white shadow-sm">
                          {student.user.firstName?.charAt(0) || "S"}
                        </div>
                      )}
                      {idx < 3 && (
                        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm ring-2 ring-white
                          ${idx === 0 ? "bg-amber-400" : idx === 1 ? "bg-slate-400" : "bg-amber-700"}
                        `}>
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-800 truncate">
                        {student.user.firstName} {student.user.lastName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${student.completionPercentage}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-indigo-600">{student.completionPercentage}%</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
          </div>

        </div>

      </div>
    </div>
  );
}
