import React, { useMemo } from "react";
import { 
  FiSearch, FiBell, FiPlus, FiUsers, FiDollarSign, 
  FiBookOpen, FiStar, FiHome, FiPieChart, FiMessageSquare, FiSettings 
} from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for the chart to match the Figma image
const chartData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 5500 },
  { name: "Mar", revenue: 6200 },
  { name: "Apr", revenue: 5800 },
  { name: "May", revenue: 8500 },
  { name: "Jun", revenue: 12000 },
];

const InstructorDashboard = ({ courses = [] }) => {
  
  // Calculate stats based on your actual course data
  const stats = useMemo(() => {
    const totalStudents = courses.reduce((acc, c) => acc + (c.studentsEnrolled || 0), 0);
    const totalRevenue = courses.reduce((acc, c) => acc + (c.price * c.studentsEnrolled || 0), 0);
    return {
      totalStudents: totalStudents.toLocaleString(),
      totalRevenue: (totalRevenue / 1000).toFixed(1) + "K",
      activeCount: courses.filter(c => c.isActive).length,
    };
  }, [courses]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* 🔵 SIDEBAR (Fixed) */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-10">
         
          <p className="text-xs text-slate-400">Instructor Dashboard</p>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<FiHome />} label="Dashboard" active />
          <NavItem icon={<FiBookOpen />} label="My Courses" />
          <NavItem icon={<FiPieChart />} label="Analytics" />
          <NavItem icon={<FiMessageSquare />} label="Reviews" />
          <NavItem icon={<FiDollarSign />} label="Earnings" />
          <NavItem icon={<FiSettings />} label="Settings" />
        </nav>
      </aside>

      {/* 🟢 MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <p className="text-sm text-slate-500">Welcome back, John! Here's what's happening.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600">
              <FiBell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              <FiPlus /> Create Course
            </button>
          </div>
        </header>

        {/* DASHBOARD GRID */}
        <main className="p-8">
          
          {/* STAT CARDS */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Students" value={stats.totalStudents} growth="+12.5%" icon={<FiUsers />} color="bg-blue-50 text-blue-600" />
            <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} growth="+18.5%" icon={<FiDollarSign />} color="bg-green-50 text-green-600" />
            <StatCard title="Active Courses" value={stats.activeCount} sub="of 6 total" icon={<FiBookOpen />} color="bg-purple-50 text-purple-600" />
            <StatCard title="Average Rating" value="4.6" sub="Excellent feedback" icon={<FiStar />} color="bg-orange-50 text-orange-600" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* REVENUE CHART */}
            <div className="col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
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
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CATEGORIES / DONUT (Simplified placeholder) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg mb-6">Course Categories</h3>
              <div className="flex items-center justify-center h-48 border-4 border-slate-50 rounded-full w-48 mx-auto relative">
                <span className="text-center">
                  <p className="text-2xl font-bold">45%</p>
                  <p className="text-xs text-slate-400">Development</p>
                </span>
              </div>
              <div className="mt-8 space-y-3">
                <CategoryLabel label="Development" percent="45%" color="bg-blue-500" />
                <CategoryLabel label="Design" percent="25%" color="bg-purple-500" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800'}`}>
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

const StatCard = ({ title, value, growth, sub, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-start">
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
      {growth && <p className="text-xs text-green-500 mt-2 font-bold">{growth} <span className="text-slate-400 font-normal">this month</span></p>}
      {sub && <p className="text-xs text-slate-400 mt-2">{sub}</p>}
    </div>
    <div className={`p-4 rounded-2xl ${color}`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
  </div>
);

const CategoryLabel = ({ label, percent, color }) => (
  <div className="flex justify-between items-center text-sm">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-slate-600">{label}</span>
    </div>
    <span className="font-bold">{percent}</span>
  </div>
);

export default InstructorDashboard;