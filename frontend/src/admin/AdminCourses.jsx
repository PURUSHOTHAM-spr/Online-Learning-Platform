import React, { useState, useEffect, useCallback, useMemo } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import {
  FiSearch, FiFilter, FiRefreshCw, FiBookOpen, FiChevronDown,
  FiToggleLeft, FiToggleRight, FiAlertCircle, FiStar, FiUsers,
  FiGrid, FiList
} from "react-icons/fi";
import AdminLayout from "./AdminLayout";

// ── Sub-components ────────────────────────────────────

const LevelBadge = ({ level }) => {
  const map = {
    Beginner:     "bg-emerald-50 text-emerald-600 border-emerald-200",
    Intermediate: "bg-amber-50 text-amber-600 border-amber-200",
    Advanced:     "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${map[level] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {level || "—"}
    </span>
  );
};

const StatusBadge = ({ active }) => (
  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${
    active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-400"}`} />
    {active ? "Active" : "Inactive"}
  </span>
);

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-amber-50">
            <FiAlertCircle size={24} className="text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition disabled:opacity-50 flex items-center gap-2">
            {loading && <FiRefreshCw size={14} className="animate-spin" />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────

function AdminCourses() {
  const [courses, setCourses]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch]             = useState("");
  const [levelFilter, setLevelFilter]   = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode]         = useState("table");
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", action: null });

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin-api/courses");
      setCourses(res.data.payload || []);
    } catch {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const filtered = useMemo(() => courses.filter(c => {
    const matchSearch = `${c.title} ${c.category}`.toLowerCase().includes(search.toLowerCase());
    const matchLevel  = levelFilter === "ALL" || c.courseLevel === levelFilter;
    const matchStatus = statusFilter === "ALL" || (statusFilter === "ACTIVE" ? c.isActive : !c.isActive);
    return matchSearch && matchLevel && matchStatus;
  }), [courses, search, levelFilter, statusFilter]);

  const handleToggleStatus = (courseId, current, title) => {
    const next = !current;
    setConfirmModal({
      open: true,
      title: `${next ? "Activate" : "Deactivate"} Course`,
      message: `Are you sure you want to ${next ? "activate" : "deactivate"} "${title}"? ${!next ? "Students won't be able to see this course." : ""}`,
      action: async () => {
        setActionLoading(true);
        try {
          const res = await axiosInstance.patch(`/admin-api/courses/${courseId}/status`, { isActive: next });
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

  const counts = useMemo(() => ({
    total:    courses.length,
    active:   courses.filter(c => c.isActive).length,
    inactive: courses.filter(c => !c.isActive).length,
    beginner: courses.filter(c => c.courseLevel === "Beginner").length,
    advanced: courses.filter(c => c.courseLevel === "Advanced").length,
  }), [courses]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">Loading courses...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal({ open: false, title: "", message: "", action: null })}
        loading={actionLoading}
      />

      {/* Page Header */}
      <header className="bg-white border-b border-slate-100 px-8 py-6 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Course Management</h2>
          <p className="text-sm text-slate-400 mt-0.5">View and manage all courses on the platform</p>
        </div>
        <button onClick={fetchCourses}
          className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 rounded-xl text-sm font-semibold hover:bg-violet-100 transition">
          <FiRefreshCw size={14} /> Refresh
        </button>
      </header>

      <main className="flex-1 p-8 overflow-auto space-y-6">

        {/* Summary tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: "Total",    val: counts.total,    bg: "bg-slate-50",   text: "text-slate-700" },
            { label: "Active",   val: counts.active,   bg: "bg-emerald-50", text: "text-emerald-700" },
            { label: "Inactive", val: counts.inactive, bg: "bg-red-50",     text: "text-red-700" },
            { label: "Beginner", val: counts.beginner, bg: "bg-blue-50",    text: "text-blue-700" },
            { label: "Advanced", val: counts.advanced, bg: "bg-orange-50",  text: "text-orange-700" },
          ].map(({ label, val, bg, text }) => (
            <div key={label} className={`${bg} rounded-xl p-4 text-center border border-white shadow-sm`}>
              <p className={`text-2xl font-bold ${text}`}>{val}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by title or category..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Level filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-violet-500 outline-none">
                <option value="ALL">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="pl-4 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-violet-500 outline-none">
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
              <button onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition ${viewMode === "table" ? "bg-white shadow text-slate-700" : "text-slate-400 hover:text-slate-600"}`}>
                <FiList size={13} /> Table
              </button>
              <button onClick={() => setViewMode("cards")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition ${viewMode === "cards" ? "bg-white shadow text-slate-700" : "text-slate-400 hover:text-slate-600"}`}>
                <FiGrid size={13} /> Cards
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">{filtered.length} of {courses.length} courses shown</p>
        </div>

        {/* ── TABLE VIEW ──────────────────────────── */}
        {viewMode === "table" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Course", "Instructor", "Level", "Students", "Rating", "Status", "Actions"].map(h => (
                      <th key={h} className={`${h === "Actions" ? "text-center" : "text-left"} px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-20 text-center text-slate-400">
                        <FiBookOpen size={36} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No courses match your filters</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(c => (
                      <tr key={c._id} className="hover:bg-slate-50/60 transition">
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
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {c.instructor ? `${c.instructor.firstName} ${c.instructor.lastName}` : "—"}
                        </td>
                        <td className="px-6 py-4"><LevelBadge level={c.courseLevel} /></td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <FiUsers size={12} className="text-slate-400" />
                            {c.studentsEnrolled || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1">
                            <FiStar size={12} className="text-amber-400 fill-amber-400" />
                            <span className="font-medium text-slate-600">{c.rating > 0 ? c.rating.toFixed(1) : "N/A"}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4"><StatusBadge active={c.isActive} /></td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleStatus(c._id, c.isActive, c.title)}
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
        )}

        {/* ── CARDS VIEW ──────────────────────────── */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-20 text-slate-400">
                <FiBookOpen size={36} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No courses match your filters</p>
              </div>
            ) : (
              filtered.map(c => (
                <div key={c._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
                  {/* Thumbnail */}
                  <div className="h-36 bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
                    {c.thumbnail && (
                      <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-3 right-3">
                      <StatusBadge active={c.isActive} />
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{c.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{c.category}</p>
                      </div>
                      <LevelBadge level={c.courseLevel} />
                    </div>

                    <p className="text-xs text-slate-500 mb-3">
                      By <span className="font-semibold text-slate-700">
                        {c.instructor ? `${c.instructor.firstName} ${c.instructor.lastName}` : "Unknown"}
                      </span>
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <FiUsers size={11} /> {c.studentsEnrolled || 0} students
                      </span>
                      <span className="flex items-center gap-1">
                        <FiStar size={11} className="text-amber-400" />
                        {c.rating > 0 ? c.rating.toFixed(1) : "No rating"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(c._id, c.isActive, c.title)}
                      disabled={actionLoading}
                      className={`w-full py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-40 ${
                        c.isActive
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      {c.isActive ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />}
                      {c.isActive ? "Deactivate Course" : "Activate Course"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </main>
    </AdminLayout>
  );
}

export default AdminCourses;
