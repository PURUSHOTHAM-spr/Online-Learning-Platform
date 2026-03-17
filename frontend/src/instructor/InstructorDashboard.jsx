import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus, FiUsers, FiDollarSign, FiBookOpen, FiStar
} from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 5500 },
  { name: "Mar", revenue: 6200 },
  { name: "Apr", revenue: 5800 },
  { name: "May", revenue: 8500 },
  { name: "Jun", revenue: 12000 },
];

const InstructorDashboard = ({ courses = [] }) => {

  const stats = useMemo(() => {
    const totalStudents = courses.reduce((acc, c) => acc + (c.studentsEnrolled || 0), 0);
    const totalRevenue  = courses.reduce((acc, c) => acc + (c.price * c.studentsEnrolled || 0), 0);
    return {
      totalStudents: totalStudents.toLocaleString(),
      totalRevenue:  (totalRevenue / 1000).toFixed(1) + "K",
      activeCount:   courses.filter(c => c.isActive).length,
    };
  }, [courses]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">

      {/* Sub-header: page title + create button */}
      <div className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">Welcome back! Here's what's happening with your courses.</p>
        </div>
        <Link
          to="/create-course"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200 text-sm"
        >
          <FiPlus size={16} /> Create Course
        </Link>
      </div>

      {/* Dashboard content */}
      <main className="p-8">

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Students" value={stats.totalStudents}      growth="+12.5%" icon={<FiUsers />}     color="bg-blue-50   text-blue-600"   />
          <StatCard title="Total Revenue"  value={`₹${stats.totalRevenue}`} growth="+18.5%" icon={<FiDollarSign />} color="bg-green-50  text-green-600"  />
          <StatCard title="Active Courses" value={stats.activeCount}         sub="of total"  icon={<FiBookOpen />}  color="bg-purple-50 text-purple-600" />
          <StatCard title="Average Rating" value="4.6"                       sub="Excellent"  icon={<FiStar />}      color="bg-orange-50 text-orange-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* REVENUE CHART */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Revenue Overview</h3>
              <select className="text-sm bg-slate-50 border-none rounded-lg px-3 py-1">
                <option>Last 6 months</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* COURSE CATEGORIES */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-6">Course Categories</h3>
            <div className="flex items-center justify-center h-48 border-4 border-slate-50 rounded-full w-48 mx-auto">
              <span className="text-center">
                <p className="text-2xl font-bold">45%</p>
                <p className="text-xs text-slate-400">Development</p>
              </span>
            </div>
            <div className="mt-8 space-y-3">
              <CategoryLabel label="Development" percent="45%" color="bg-blue-500"   />
              <CategoryLabel label="Design"      percent="25%" color="bg-purple-500" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ── Sub-components ─────────────────────────────── */

const StatCard = ({ title, value, growth, sub, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-start">
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
      {growth && <p className="text-xs text-green-500 mt-2 font-bold">{growth} <span className="text-slate-400 font-normal">this month</span></p>}
      {sub    && <p className="text-xs text-slate-400 mt-2">{sub}</p>}
    </div>
    <div className={`p-4 rounded-2xl ${color}`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
  </div>
);

const CategoryLabel = ({ label, percent, color }) => (
  <div className="flex justify-between items-center text-sm">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-slate-600">{label}</span>
    </div>
    <span className="font-bold">{percent}</span>
  </div>
);

export default InstructorDashboard;