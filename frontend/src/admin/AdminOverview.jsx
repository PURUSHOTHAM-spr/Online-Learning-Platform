import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import {
  FiUsers, FiBookOpen, FiTrendingUp, FiStar,
  FiUserCheck, FiUserX, FiShield, FiActivity,
  FiArrowRight, FiRefreshCw, FiBarChart2
} from "react-icons/fi";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import AdminLayout from "./AdminLayout";

const PIE_COLORS = ["#7c3aed", "#3b82f6", "#ef4444"];

const StatCard = ({ title, value, sub, icon, color, iconBg, link }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-0.5 flex justify-between items-start group">
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-3xl font-bold mt-2 text-slate-800">{value ?? "—"}</h3>
      {sub && <p className="text-xs text-slate-400 mt-2">{sub}</p>}
      {link && (
        <Link to={link} className="inline-flex items-center gap-1 text-xs text-violet-600 font-semibold mt-3 hover:gap-2 transition-all">
          View details <FiArrowRight size={12} />
        </Link>
      )}
    </div>
    <div className={`p-4 rounded-2xl ${iconBg} group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon, { size: 22, className: color })}
    </div>
  </div>
);

function AdminOverview() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [stats, setStats] = useState(null);
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
      { name: "Students", value: stats.students },
      { name: "Admins", value: stats.admins },
    ];
  }, [stats]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">Loading overview...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <header className="bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Welcome back, <span className="font-semibold text-slate-600">{user?.firstName}</span>! Here's your platform summary.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 rounded-xl text-sm font-semibold hover:bg-violet-100 transition"
        >
          <FiRefreshCw size={14} />
          Refresh
        </button>
      </header>

      <main className="flex-1 p-8 overflow-auto space-y-8">

        {/* ── STAT CARDS ─────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers}
            sub={`${stats?.activeUsers} active users`}
            icon={<FiUsers />}
            color="text-violet-600"
            iconBg="bg-violet-50"
            link="/admin/users"
          />
          <StatCard
            title="Total Courses"
            value={stats?.totalCourses}
            sub={`${stats?.activeCourses} active courses`}
            icon={<FiBookOpen />}
            color="text-blue-600"
            iconBg="bg-blue-50"
            link="/admin/courses"
          />
          <StatCard
            title="Total Enrollments"
            value={stats?.totalEnrollments}
            sub={`${stats?.totalReviews} total reviews`}
            icon={<FiTrendingUp />}
            color="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <StatCard
            title="Avg. Rating"
            value={stats?.avgRating}
            sub="Platform-wide average"
            icon={<FiStar />}
            color="text-amber-500"
            iconBg="bg-amber-50"
          />
        </div>

        {/* ── CHARTS ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Signups Area Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-800">User Signups</h3>
                <p className="text-xs text-slate-400 mt-0.5">New registrations over time</p>
              </div>
              <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">Last 6 months</span>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlySignups || []}>
                  <defs>
                    <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)" }}
                    labelStyle={{ fontWeight: 700 }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorSignups)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart — User Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 mb-2">User Roles</h3>
            <p className="text-xs text-slate-400 mb-4">Distribution across platform</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={78}
                    paddingAngle={4} dataKey="value"
                  >
                    {roleDistribution.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-2.5">
              {[
                { label: "Instructors", val: stats?.instructors, color: "bg-violet-600" },
                { label: "Students",    val: stats?.students,    color: "bg-blue-500" },
                { label: "Admins",      val: stats?.admins,      color: "bg-red-500" },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex justify-between text-sm items-center">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className={`w-2.5 h-2.5 rounded-full ${color}`} /> {label}
                  </span>
                  <span className="font-bold text-slate-700">{val ?? 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── QUICK STAT TILES ────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-5 rounded-2xl text-white shadow-lg shadow-violet-200">
            <div className="flex items-center gap-2 mb-2">
              <FiUserCheck size={16} />
              <span className="text-xs font-medium opacity-80">Active Users</span>
            </div>
            <p className="text-3xl font-bold">{stats?.activeUsers ?? 0}</p>
          </div>
          <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-5 rounded-2xl text-white shadow-lg shadow-rose-200">
            <div className="flex items-center gap-2 mb-2">
              <FiUserX size={16} />
              <span className="text-xs font-medium opacity-80">Inactive Users</span>
            </div>
            <p className="text-3xl font-bold">{stats?.inactiveUsers ?? 0}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-5 rounded-2xl text-white shadow-lg shadow-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <FiShield size={16} />
              <span className="text-xs font-medium opacity-80">Instructors</span>
            </div>
            <p className="text-3xl font-bold">{stats?.instructors ?? 0}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-5 rounded-2xl text-white shadow-lg shadow-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <FiActivity size={16} />
              <span className="text-xs font-medium opacity-80">Total Reviews</span>
            </div>
            <p className="text-3xl font-bold">{stats?.totalReviews ?? 0}</p>
          </div>
        </div>

        {/* ── QUICK LINKS ─────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Manage Users",   desc: "View, edit roles, activate/deactivate",  path: "/admin/users",     color: "from-violet-50 to-indigo-50", border: "border-violet-100", icon: <FiUsers size={20} className="text-violet-600" /> },
            { label: "Manage Courses", desc: "Toggle course visibility and status",     path: "/admin/courses",   color: "from-blue-50 to-cyan-50",   border: "border-blue-100",   icon: <FiBookOpen size={20} className="text-blue-600" /> },
            { label: "Analytics",      desc: "Deep dive into platform performance",     path: "/admin/analytics", color: "from-emerald-50 to-teal-50", border: "border-emerald-100", icon: <FiBarChart2 size={20} className="text-emerald-600" /> },
          ].map(({ label, desc, path, color, border, icon }) => (
            <Link
              key={path}
              to={path}
              className={`group bg-gradient-to-br ${color} border ${border} p-5 rounded-2xl hover:shadow-md transition-all hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between mb-3">
                {icon}
                <FiArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="font-bold text-slate-800 text-sm">{label}</p>
              <p className="text-xs text-slate-500 mt-1">{desc}</p>
            </Link>
          ))}
        </div>

      </main>
    </AdminLayout>
  );
}

export default AdminOverview;
