import React, { useState, useEffect, useMemo, useCallback } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import {
  FiUsers, FiBookOpen, FiBarChart2, FiHome, FiSettings,
  FiSearch, FiBell, FiChevronDown, FiToggleLeft, FiToggleRight,
  FiShield, FiTrendingUp, FiStar, FiUserCheck, FiUserX,
  FiFilter, FiRefreshCw, FiAlertCircle
} from "react-icons/fi";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

// ─── Sidebar Navigation Item ─────────────────────────────
const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-left ${
      active
        ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
    }`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);

// ─── Stat Card ────────────────────────────────────────────
const StatCard = ({ title, value, sub, icon, color, iconBg }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex justify-between items-start">
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-3xl font-bold mt-2 text-slate-800">{value}</h3>
      {sub && <p className="text-xs text-slate-400 mt-2">{sub}</p>}
    </div>
    <div className={`p-4 rounded-2xl ${iconBg}`}>
      {React.cloneElement(icon, { size: 22, className: color })}
    </div>
  </div>
);

// ─── Role Badge ───────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const styles = {
    ADMIN: "bg-red-50 text-red-600 border-red-200",
    INSTRUCTOR: "bg-purple-50 text-purple-600 border-purple-200",
    STUDENT: "bg-blue-50 text-blue-600 border-blue-200",
  };
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${styles[role] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {role}
    </span>
  );
};

// ─── Status Badge ─────────────────────────────────────────
const StatusBadge = ({ active }) => (
  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
    active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
  }`}>
    {active ? "Active" : "Inactive"}
  </span>
);

// ─── Confirmation Modal ───────────────────────────────────
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-amber-50">
            <FiAlertCircle size={24} className="text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <FiRefreshCw size={14} className="animate-spin" />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── PIE CHART COLORS ─────────────────────────────────────
const PIE_COLORS = ["#7c3aed", "#3b82f6", "#ef4444"];

// ═══════════════════════════════════════════════════════════
//  MAIN ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════
function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  // ─── State ────────────────────────────────────
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Data
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  // Filters
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [userStatusFilter, setUserStatusFilter] = useState("ALL");
  const [courseSearch, setCourseSearch] = useState("");
  const [courseLevelFilter, setCourseLevelFilter] = useState("ALL");
  const [courseStatusFilter, setCourseStatusFilter] = useState("ALL");

  // Confirm modal
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", action: null });

  // ─── Fetch Data ───────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin-api/stats");
      setStats(res.data.payload);
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin-api/users");
      setUsers(res.data.payload || []);
    } catch (err) {
      console.error("Users fetch error:", err);
      toast.error("Failed to fetch users");
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin-api/courses");
      setCourses(res.data.payload || []);
    } catch (err) {
      console.error("Courses fetch error:", err);
      toast.error("Failed to fetch courses");
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers(), fetchCourses()]);
      setLoading(false);
    };
    init();
  }, [fetchStats, fetchUsers, fetchCourses]);

  // ─── User Actions ─────────────────────────────
  const handleToggleUserStatus = (userId, currentStatus, userName) => {
    const newStatus = !currentStatus;
    setConfirmModal({
      open: true,
      title: `${newStatus ? "Activate" : "Deactivate"} User`,
      message: `Are you sure you want to ${newStatus ? "activate" : "deactivate"} "${userName}"? ${!newStatus ? "They will no longer be able to log in." : ""}`,
      action: async () => {
        setActionLoading(true);
        try {
          const res = await axiosInstance.patch(`/admin-api/users/${userId}/status`, { isActive: newStatus });
          setUsers(prev => prev.map(u => u._id === userId ? res.data.payload : u));
          toast.success(res.data.message);
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to update status");
        } finally {
          setActionLoading(false);
          setConfirmModal({ open: false, title: "", message: "", action: null });
        }
      }
    });
  };

  const handleChangeRole = async (userId, newRole) => {
    setActionLoading(true);
    try {
      const res = await axiosInstance.patch(`/admin-api/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? res.data.payload : u));
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Course Actions ───────────────────────────
  const handleToggleCourseStatus = (courseId, currentStatus, courseTitle) => {
    const newStatus = !currentStatus;
    setConfirmModal({
      open: true,
      title: `${newStatus ? "Activate" : "Deactivate"} Course`,
      message: `Are you sure you want to ${newStatus ? "activate" : "deactivate"} "${courseTitle}"? ${!newStatus ? "Students won't be able to see this course." : ""}`,
      action: async () => {
        setActionLoading(true);
        try {
          const res = await axiosInstance.patch(`/admin-api/courses/${courseId}/status`, { isActive: newStatus });
          setCourses(prev => prev.map(c => c._id === courseId ? res.data.payload : c));
          toast.success(res.data.message);
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to update course status");
        } finally {
          setActionLoading(false);
          setConfirmModal({ open: false, title: "", message: "", action: null });
        }
      }
    });
  };

  // ─── Filtered data ────────────────────────────
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch =
        `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
      const matchStatus =
        userStatusFilter === "ALL" ||
        (userStatusFilter === "ACTIVE" && u.isActive) ||
        (userStatusFilter === "INACTIVE" && !u.isActive);
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, userSearch, userRoleFilter, userStatusFilter]);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchSearch =
        `${c.title} ${c.category}`.toLowerCase().includes(courseSearch.toLowerCase());
      const matchLevel = courseLevelFilter === "ALL" || c.courseLevel === courseLevelFilter;
      const matchStatus =
        courseStatusFilter === "ALL" ||
        (courseStatusFilter === "ACTIVE" && c.isActive) ||
        (courseStatusFilter === "INACTIVE" && !c.isActive);
      return matchSearch && matchLevel && matchStatus;
    });
  }, [courses, courseSearch, courseLevelFilter, courseStatusFilter]);

  // ─── Role Distribution for Pie Chart ──────────
  const roleDistribution = useMemo(() => {
    if (!stats) return [];
    return [
      { name: "Instructors", value: stats.instructors },
      { name: "Students", value: stats.students },
      { name: "Admins", value: stats.admins },
    ];
  }, [stats]);

  // ─── Loading Screen ───────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════
  //  RENDER
  // ═════════════════════════════════════════════════
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal({ open: false, title: "", message: "", action: null })}
        loading={actionLoading}
      />

      {/* ─── SIDEBAR ─────────────────────────────── */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col p-6 sticky top-0 h-screen shrink-0">
        <div className="mb-10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            CourseHub
          </h1>
          <p className="text-xs text-slate-400 mt-1">Admin Control Panel</p>
        </div>

        <nav className="flex-1 space-y-1.5">
          <NavItem icon={<FiHome size={18} />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <NavItem icon={<FiUsers size={18} />} label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
          <NavItem icon={<FiBookOpen size={18} />} label="Courses" active={activeTab === "courses"} onClick={() => setActiveTab("courses")} />
          <NavItem icon={<FiBarChart2 size={18} />} label="Analytics" active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
        </nav>

        {/* Admin Info */}
        <div className="border-t border-slate-700 pt-5 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-900/30">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "users" && "User Management"}
              {activeTab === "courses" && "Course Management"}
              {activeTab === "analytics" && "Platform Analytics"}
            </h2>
            <p className="text-sm text-slate-400">
              Welcome back, {user?.firstName}! Here's your platform summary.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition">
              <FiBell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 p-8 overflow-auto">

          {/* ══════════════════════════════════════════ */}
          {/*  OVERVIEW TAB                              */}
          {/* ══════════════════════════════════════════ */}
          {activeTab === "overview" && stats && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} sub={`${stats.activeUsers} active`} icon={<FiUsers />} color="text-violet-600" iconBg="bg-violet-50" />
                <StatCard title="Total Courses" value={stats.totalCourses} sub={`${stats.activeCourses} active`} icon={<FiBookOpen />} color="text-blue-600" iconBg="bg-blue-50" />
                <StatCard title="Total Enrollments" value={stats.totalEnrollments} sub={`${stats.totalReviews} reviews`} icon={<FiTrendingUp />} color="text-emerald-600" iconBg="bg-emerald-50" />
                <StatCard title="Avg. Rating" value={stats.avgRating} sub="Platform-wide" icon={<FiStar />} color="text-amber-500" iconBg="bg-amber-50" />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Signups Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-800">User Signups</h3>
                    <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">Last 6 months</span>
                  </div>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.monthlySignups}>
                        <defs>
                          <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                          labelStyle={{ fontWeight: 700 }}
                        />
                        <Area type="monotone" dataKey="users" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorSignups)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Role Distribution */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-lg text-slate-800 mb-6">User Distribution</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                          {roleDistribution.map((_, i) => (
                            <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-violet-600"></span> Instructors</span>
                      <span className="font-bold text-slate-700">{stats.instructors}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Students</span>
                      <span className="font-bold text-slate-700">{stats.students}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Admins</span>
                      <span className="font-bold text-slate-700">{stats.admins}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Bar */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-5 rounded-2xl text-white">
                  <div className="flex items-center gap-2 mb-2"><FiUserCheck size={16} /><span className="text-xs font-medium opacity-80">Active Users</span></div>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                </div>
                <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-5 rounded-2xl text-white">
                  <div className="flex items-center gap-2 mb-2"><FiUserX size={16} /><span className="text-xs font-medium opacity-80">Inactive Users</span></div>
                  <p className="text-2xl font-bold">{stats.inactiveUsers}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-5 rounded-2xl text-white">
                  <div className="flex items-center gap-2 mb-2"><FiShield size={16} /><span className="text-xs font-medium opacity-80">Instructors</span></div>
                  <p className="text-2xl font-bold">{stats.instructors}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-5 rounded-2xl text-white">
                  <div className="flex items-center gap-2 mb-2"><FiStar size={16} /><span className="text-xs font-medium opacity-80">Total Reviews</span></div>
                  <p className="text-2xl font-bold">{stats.totalReviews}</p>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════ */}
          {/*  USERS TAB                                 */}
          {/* ══════════════════════════════════════════ */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Search */}
                  <div className="relative flex-1 min-w-[250px]">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  {/* Role Filter */}
                  <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-violet-500 outline-none"
                    >
                      <option value="ALL">All Roles</option>
                      <option value="STUDENT">Students</option>
                      <option value="INSTRUCTOR">Instructors</option>
                      <option value="ADMIN">Admins</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                  </div>
                  {/* Status Filter */}
                  <div className="relative">
                    <select
                      value={userStatusFilter}
                      onChange={(e) => setUserStatusFilter(e.target.value)}
                      className="pl-4 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-violet-500 outline-none"
                    >
                      <option value="ALL">All Status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                  </div>
                  {/* Refresh */}
                  <button onClick={fetchUsers} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 transition" title="Refresh">
                    <FiRefreshCw size={16} />
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-3">{filteredUsers.length} of {users.length} users shown</p>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">User</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Email</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Role</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Joined</th>
                        <th className="text-center px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-16 text-center text-slate-400">
                            <FiUsers size={32} className="mx-auto mb-3 opacity-40" />
                            <p className="font-medium">No users found</p>
                            <p className="text-xs mt-1">Try adjusting your search or filters.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u._id} className="hover:bg-slate-50/50 transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                  {u.firstName?.[0]}{u.lastName?.[0]}
                                </div>
                                <span className="font-semibold text-slate-700">{u.firstName} {u.lastName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500">{u.email}</td>
                            <td className="px-6 py-4">
                              <select
                                value={u.role}
                                onChange={(e) => handleChangeRole(u._id, e.target.value)}
                                disabled={u._id === user?._id || actionLoading}
                                className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer focus:ring-2 focus:ring-violet-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <option value="STUDENT">STUDENT</option>
                                <option value="INSTRUCTOR">INSTRUCTOR</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                            </td>
                            <td className="px-6 py-4"><StatusBadge active={u.isActive} /></td>
                            <td className="px-6 py-4 text-slate-400 text-xs">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleToggleUserStatus(u._id, u.isActive, `${u.firstName} ${u.lastName}`)}
                                disabled={u._id === user?._id || actionLoading}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${
                                  u.isActive
                                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                }`}
                                title={u._id === user?._id ? "You cannot modify your own account" : ""}
                              >
                                {u.isActive ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />}
                                {u.isActive ? "Deactivate" : "Activate"}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════ */}
          {/*  COURSES TAB                               */}
          {/* ══════════════════════════════════════════ */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative flex-1 min-w-[250px]">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search courses by title or category..."
                      value={courseSearch}
                      onChange={(e) => setCourseSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={courseLevelFilter}
                      onChange={(e) => setCourseLevelFilter(e.target.value)}
                      className="pl-4 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-violet-500 outline-none"
                    >
                      <option value="ALL">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                  </div>
                  <div className="relative">
                    <select
                      value={courseStatusFilter}
                      onChange={(e) => setCourseStatusFilter(e.target.value)}
                      className="pl-4 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-violet-500 outline-none"
                    >
                      <option value="ALL">All Status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                  </div>
                  <button onClick={fetchCourses} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 transition" title="Refresh">
                    <FiRefreshCw size={16} />
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-3">{filteredCourses.length} of {courses.length} courses shown</p>
              </div>

              {/* Courses Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Course</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Instructor</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Level</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Students</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Rating</th>
                        <th className="text-left px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                        <th className="text-center px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredCourses.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-16 text-center text-slate-400">
                            <FiBookOpen size={32} className="mx-auto mb-3 opacity-40" />
                            <p className="font-medium">No courses found</p>
                            <p className="text-xs mt-1">Try adjusting your search or filters.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredCourses.map((c) => (
                          <tr key={c._id} className="hover:bg-slate-50/50 transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shrink-0 overflow-hidden">
                                  {c.thumbnail ? (
                                    <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <FiBookOpen size={16} />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-slate-700 truncate max-w-[200px]">{c.title}</p>
                                  <p className="text-xs text-slate-400">{c.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {c.instructor ? `${c.instructor.firstName} ${c.instructor.lastName}` : "—"}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                c.courseLevel === "Beginner" ? "bg-emerald-50 text-emerald-600" :
                                c.courseLevel === "Intermediate" ? "bg-amber-50 text-amber-600" :
                                "bg-red-50 text-red-600"
                              }`}>
                                {c.courseLevel}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-medium">{c.studentsEnrolled || 0}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                <FiStar size={12} className="text-amber-400 fill-amber-400" />
                                <span className="font-medium text-slate-600">{c.rating > 0 ? c.rating.toFixed(1) : "N/A"}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4"><StatusBadge active={c.isActive} /></td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleToggleCourseStatus(c._id, c.isActive, c.title)}
                                disabled={actionLoading}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-40 ${
                                  c.isActive
                                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                }`}
                              >
                                {c.isActive ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />}
                                {c.isActive ? "Deactivate" : "Activate"}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════ */}
          {/*  ANALYTICS TAB                             */}
          {/* ══════════════════════════════════════════ */}
          {activeTab === "analytics" && stats && (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="text-sm text-slate-500 font-medium mb-4">User Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Students</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.totalUsers ? (stats.students / stats.totalUsers) * 100 : 0}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700 w-8 text-right">{stats.students}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Instructors</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-violet-500 rounded-full" style={{ width: `${stats.totalUsers ? (stats.instructors / stats.totalUsers) * 100 : 0}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700 w-8 text-right">{stats.instructors}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Admins</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${stats.totalUsers ? (stats.admins / stats.totalUsers) * 100 : 0}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700 w-8 text-right">{stats.admins}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="text-sm text-slate-500 font-medium mb-4">Course Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Active Courses</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.totalCourses ? (stats.activeCourses / stats.totalCourses) * 100 : 0}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700 w-8 text-right">{stats.activeCourses}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Inactive Courses</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400 rounded-full" style={{ width: `${stats.totalCourses ? ((stats.totalCourses - stats.activeCourses) / stats.totalCourses) * 100 : 0}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700 w-8 text-right">{stats.totalCourses - stats.activeCourses}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="text-sm text-slate-500 font-medium mb-4">Platform Health</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                      <span className="text-sm text-slate-600">Avg Rating</span>
                      <span className="text-lg font-bold text-emerald-600 flex items-center gap-1"><FiStar size={14} className="text-amber-400" /> {stats.avgRating}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                      <span className="text-sm text-slate-600">Enrollments</span>
                      <span className="text-lg font-bold text-blue-600">{stats.totalEnrollments}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-violet-50 rounded-xl">
                      <span className="text-sm text-slate-600">Reviews</span>
                      <span className="text-lg font-bold text-violet-600">{stats.totalReviews}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full-width User Signups Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-slate-800">User Growth Trend</h3>
                  <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">Last 6 months</span>
                </div>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlySignups}>
                      <defs>
                        <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                        labelStyle={{ fontWeight: 700 }}
                      />
                      <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Role Distribution Pie — full width */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-6">Role Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {roleDistribution.map((_, i) => (
                          <Cell key={`cell-a-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend iconType="circle" iconSize={10} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;