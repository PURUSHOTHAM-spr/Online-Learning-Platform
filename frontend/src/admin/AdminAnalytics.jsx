import React, { useState, useEffect, useCallback, useMemo } from "react";
import { axiosInstance } from "../api/axiosInstance";
import {
  FiRefreshCw, FiUsers, FiBookOpen, FiStar, FiTrendingUp,
  FiUserCheck, FiUserX, FiShield, FiBarChart2
} from "react-icons/fi";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";
import AdminLayout from "./AdminLayout";

const PIE_COLORS = ["#7c3aed", "#3b82f6", "#ef4444"];

function AdminAnalytics() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin-api/stats");
      setStats(res.data.payload);
    } catch (err) {
      console.error("Stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const roleDistribution = useMemo(() => {
    if (!stats) return [];
    return [
      { name: "Instructors", value: stats.instructors },
      { name: "Students",    value: stats.students },
      { name: "Admins",      value: stats.admins },
    ];
  }, [stats]);

  const userStatusData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: "Active",   value: stats.activeUsers },
      { name: "Inactive", value: stats.inactiveUsers },
    ];
  }, [stats]);

  const courseStatusData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: "Active",   value: stats.activeCourses },
      { name: "Inactive", value: stats.totalCourses - stats.activeCourses },
    ];
  }, [stats]);

  const radialData = useMemo(() => {
    if (!stats || !stats.totalUsers) return [];
    return [
      { name: "Students",    value: ((stats.students / stats.totalUsers) * 100).toFixed(0),    fill: "#3b82f6" },
      { name: "Instructors", value: ((stats.instructors / stats.totalUsers) * 100).toFixed(0), fill: "#7c3aed" },
      { name: "Admins",      value: ((stats.admins / stats.totalUsers) * 100).toFixed(0),      fill: "#ef4444" },
    ];
  }, [stats]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Platform Analytics</h2>
          <p className="text-sm text-slate-400 mt-0.5">Deep insights into platform performance</p>
        </div>
        <button onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 rounded-xl text-sm font-semibold hover:bg-violet-100 transition">
          <FiRefreshCw size={14} /> Refresh
        </button>
      </header>

      <main className="flex-1 p-8 overflow-auto space-y-8">

        {/* ── KPI CARDS ───────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: <FiUsers />,     label: "Total Users",       val: stats?.totalUsers,       accent: "from-violet-500 to-indigo-500", shadow: "shadow-violet-200" },
            { icon: <FiBookOpen />,  label: "Total Courses",     val: stats?.totalCourses,     accent: "from-blue-500 to-cyan-500",    shadow: "shadow-blue-200" },
            { icon: <FiTrendingUp />,label: "Total Enrollments", val: stats?.totalEnrollments, accent: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-200" },
            { icon: <FiStar />,      label: "Avg. Rating",       val: stats?.avgRating,        accent: "from-amber-500 to-orange-500", shadow: "shadow-amber-200" },
          ].map(({ icon, label, val, accent, shadow }) => (
            <div key={label} className={`bg-gradient-to-br ${accent} p-5 rounded-2xl text-white shadow-lg ${shadow} hover:-translate-y-0.5 transition-transform`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold opacity-80">{label}</span>
                {React.cloneElement(icon, { size: 18, className: "opacity-80" })}
              </div>
              <p className="text-3xl font-bold">{val ?? "—"}</p>
            </div>
          ))}
        </div>

        {/* ── USER GROWTH CHART (full-width) ─────── */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-800">User Growth Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Monthly new registrations</p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">Last 6 months</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlySignups || []}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)" }} labelStyle={{ fontWeight: 700 }} />
                <Area type="monotone" dataKey="users" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#growthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── MIDDLE ROW: 3 charts ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Role Distribution Pie */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-base text-slate-800 mb-1">Role Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Users by role type</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {roleDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Status Bar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-base text-slate-800 mb-1">User Status</h3>
            <p className="text-xs text-slate-400 mb-4">Active vs inactive accounts</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userStatusData} barSize={48}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)" }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {userStatusData.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#10b981" : "#ef4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Course Status Bar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-base text-slate-800 mb-1">Course Status</h3>
            <p className="text-xs text-slate-400 mb-4">Active vs inactive courses</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseStatusData} barSize={48}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)" }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {courseStatusData.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#7c3aed" : "#94a3b8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── BREAKDOWN CARDS ─────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* User Breakdown */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
              <FiUsers size={16} className="text-violet-500" /> User Breakdown
            </h4>
            <p className="text-xs text-slate-400 mb-5">Proportion of each user role</p>
            <div className="space-y-4">
              {[
                { label: "Students",    val: stats?.students,    total: stats?.totalUsers, color: "bg-blue-500" },
                { label: "Instructors", val: stats?.instructors, total: stats?.totalUsers, color: "bg-violet-500" },
                { label: "Admins",      val: stats?.admins,      total: stats?.totalUsers, color: "bg-red-500" },
              ].map(({ label, val, total, color }) => {
                const pct = total ? ((val / total) * 100).toFixed(1) : 0;
                return (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-600 font-medium">{label}</span>
                      <span className="font-bold text-slate-800">{val} <span className="text-xs text-slate-400 font-normal">({pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course Breakdown */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
              <FiBookOpen size={16} className="text-blue-500" /> Course Breakdown
            </h4>
            <p className="text-xs text-slate-400 mb-5">Course visibility stats</p>
            <div className="space-y-4">
              {[
                { label: "Active Courses",   val: stats?.activeCourses,                         total: stats?.totalCourses, color: "bg-emerald-500" },
                { label: "Inactive Courses", val: (stats?.totalCourses - stats?.activeCourses),  total: stats?.totalCourses, color: "bg-slate-400" },
              ].map(({ label, val, total, color }) => {
                const pct = total ? ((val / total) * 100).toFixed(1) : 0;
                return (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-600 font-medium">{label}</span>
                      <span className="font-bold text-slate-800">{val} <span className="text-xs text-slate-400 font-normal">({pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platform Health */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
              <FiBarChart2 size={16} className="text-emerald-500" /> Platform Health
            </h4>
            <p className="text-xs text-slate-400 mb-5">Key performance metrics</p>
            <div className="space-y-3">
              {[
                { label: "Avg. Rating",       val: stats?.avgRating,         bg: "bg-amber-50",   text: "text-amber-700",   icon: <FiStar size={14} /> },
                { label: "Total Enrollments", val: stats?.totalEnrollments,  bg: "bg-blue-50",    text: "text-blue-700",    icon: <FiTrendingUp size={14} /> },
                { label: "Total Reviews",     val: stats?.totalReviews,      bg: "bg-violet-50",  text: "text-violet-700",  icon: <FiShield size={14} /> },
                { label: "Active Users",      val: stats?.activeUsers,       bg: "bg-emerald-50", text: "text-emerald-700", icon: <FiUserCheck size={14} /> },
                { label: "Inactive Users",    val: stats?.inactiveUsers,     bg: "bg-red-50",     text: "text-red-700",     icon: <FiUserX size={14} /> },
              ].map(({ label, val, bg, text, icon }) => (
                <div key={label} className={`flex justify-between items-center px-4 py-3 ${bg} rounded-xl`}>
                  <span className={`text-sm font-medium ${text} flex items-center gap-2`}>
                    {icon} {label}
                  </span>
                  <span className={`font-bold ${text}`}>{val ?? "—"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </AdminLayout>
  );
}

export default AdminAnalytics;
