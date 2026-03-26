import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import {
  FiPlus, FiUsers, FiDollarSign, FiBookOpen, FiStar
} from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const InstructorDashboard = () => {
  const [data, setData] = useState({
    stats: {
      totalStudents: 0,
      totalRevenue: 0,
      activeCount: 0,
      averageRating: "0.0"
    },
    categoriesData: [],
    chartData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axiosInstance.get("/instructor-api/dashboard-stats");
        if (res.data.payload) {
          setData(res.data.payload);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const { stats, categoriesData, chartData } = data;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans text-slate-500">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const formattedRevenue = stats.totalRevenue >= 1000 
    ? (stats.totalRevenue / 1000).toFixed(1) + "K" 
    : stats.totalRevenue;
  
  const formattedStudents = stats.totalStudents.toLocaleString();

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
          <StatCard title="Total Students" value={formattedStudents}      growth={null} icon={<FiUsers />}     color="bg-blue-50   text-blue-600"   />
          <StatCard title="Total Revenue"  value={`₹${formattedRevenue}`} growth={null} icon={<FiDollarSign />} color="bg-green-50  text-green-600"  />
          <StatCard title="Active Courses" value={stats.activeCount}         sub="of total"  icon={<FiBookOpen />}  color="bg-purple-50 text-purple-600" />
          <StatCard title="Average Rating" value={stats.averageRating}       sub="Based on reviews"  icon={<FiStar />}      color="bg-orange-50 text-orange-600" />
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
            
            {categoriesData.length > 0 ? (
              <>
                <div className="flex items-center justify-center h-48 border-4 border-slate-50 rounded-full w-48 mx-auto">
                  <span className="text-center">
                    <p className="text-2xl font-bold">{categoriesData[0]?.percent || 0}%</p>
                    <p className="text-xs text-slate-400 truncate max-w-[100px]">{categoriesData[0]?.label || "N/A"}</p>
                  </span>
                </div>
                <div className="mt-8 space-y-3">
                  {categoriesData.map((cat, idx) => (
                    <CategoryLabel 
                      key={idx} 
                      label={cat.label} 
                      percent={`${cat.percent}%`} 
                      color={idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-purple-500" : idx === 2 ? "bg-green-500" : "bg-slate-500"}   
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                No categorical data available
              </div>
            )}
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