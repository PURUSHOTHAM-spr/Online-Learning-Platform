import React, { useState, useEffect, useCallback, useMemo } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import {
  FiSearch, FiFilter, FiRefreshCw, FiUsers, FiChevronDown,
  FiToggleLeft, FiToggleRight, FiAlertCircle, FiMail,
  FiCalendar, FiUser
} from "react-icons/fi";
import AdminLayout from "./AdminLayout";

// ── Sub-components ────────────────────────────────────

const RoleBadge = ({ role }) => {
  const map = {
    ADMIN:      "bg-red-50 text-red-600 border-red-200",
    INSTRUCTOR: "bg-purple-50 text-purple-600 border-purple-200",
    STUDENT:    "bg-blue-50 text-blue-600 border-blue-200",
  };
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${map[role] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {role}
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

// ── Main Component ────────────────────────────────────

function AdminUsers() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch]           = useState("");
  const [roleFilter, setRoleFilter]   = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", action: null });
  const [viewMode, setViewMode]       = useState("table"); // "table" | "cards"

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin-api/users");
      setUsers(res.data.payload || []);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = useMemo(() => users.filter(u => {
    const matchSearch = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === "ALL" || u.role === roleFilter;
    const matchStatus = statusFilter === "ALL" || (statusFilter === "ACTIVE" ? u.isActive : !u.isActive);
    return matchSearch && matchRole && matchStatus;
  }), [users, search, roleFilter, statusFilter]);

  const handleToggleStatus = (userId, current, name) => {
    const next = !current;
    setConfirmModal({
      open: true,
      title: `${next ? "Activate" : "Deactivate"} User`,
      message: `Are you sure you want to ${next ? "activate" : "deactivate"} "${name}"? ${!next ? "They will no longer be able to log in." : ""}`,
      action: async () => {
        setActionLoading(true);
        try {
          const res = await axiosInstance.patch(`/admin-api/users/${userId}/status`, { isActive: next });
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

  // Summary counts
  const counts = useMemo(() => ({
    total:       users.length,
    students:    users.filter(u => u.role === "STUDENT").length,
    instructors: users.filter(u => u.role === "INSTRUCTOR").length,
    admins:      users.filter(u => u.role === "ADMIN").length,
    active:      users.filter(u => u.isActive).length,
  }), [users]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">Loading users...</p>
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
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-400 mt-0.5">Manage platform users, roles, and account status</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 rounded-xl text-sm font-semibold hover:bg-violet-100 transition"
        >
          <FiRefreshCw size={14} />
          Refresh
        </button>
      </header>

      <main className="flex-1 p-8 overflow-auto space-y-6">

        {/* Summary Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: "Total", val: counts.total,       bg: "bg-slate-50",    text: "text-slate-700" },
            { label: "Students",    val: counts.students,    bg: "bg-blue-50",     text: "text-blue-700" },
            { label: "Instructors", val: counts.instructors, bg: "bg-violet-50",   text: "text-violet-700" },
            { label: "Admins",      val: counts.admins,      bg: "bg-red-50",      text: "text-red-700" },
            { label: "Active",      val: counts.active,      bg: "bg-emerald-50",  text: "text-emerald-700" },
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
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Role filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-violet-500 outline-none"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Students</option>
                <option value="INSTRUCTOR">Instructors</option>
                <option value="ADMIN">Admins</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="pl-4 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-violet-500 outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${viewMode === "table" ? "bg-white shadow text-slate-700" : "text-slate-400 hover:text-slate-600"}`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${viewMode === "cards" ? "bg-white shadow text-slate-700" : "text-slate-400 hover:text-slate-600"}`}
              >
                Cards
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">{filtered.length} of {users.length} users shown</p>
        </div>

        {/* ── TABLE VIEW ──────────────────────────── */}
        {viewMode === "table" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["User", "Email", "Role", "Status", "Joined", "Actions"].map(h => (
                      <th key={h} className={`${h === "Actions" ? "text-center" : "text-left"} px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-20 text-center text-slate-400">
                        <FiUsers size={36} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No users match your filters</p>
                        <p className="text-xs mt-1">Try clearing your search or filters.</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(u => (
                      <tr key={u._id} className="hover:bg-slate-50/60 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {u.firstName?.[0]}{u.lastName?.[0]}
                            </div>
                            <span className="font-semibold text-slate-700">{u.firstName} {u.lastName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{u.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={u.role}
                            onChange={e => handleChangeRole(u._id, e.target.value)}
                            disabled={u._id === currentUser?._id || actionLoading}
                            className="text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer focus:ring-2 focus:ring-violet-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
                            onClick={() => handleToggleStatus(u._id, u.isActive, `${u.firstName} ${u.lastName}`)}
                            disabled={u._id === currentUser?._id || actionLoading}
                            title={u._id === currentUser?._id ? "You cannot modify your own account" : ""}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${
                              u.isActive
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            }`}
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
        )}

        {/* ── CARDS VIEW ──────────────────────────── */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-20 text-slate-400">
                <FiUsers size={36} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No users match your filters</p>
              </div>
            ) : (
              filtered.map(u => (
                <div key={u._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
                      {u.firstName?.[0]}{u.lastName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <FiMail size={11} /> {u.email}
                      </p>
                    </div>
                    <StatusBadge active={u.isActive} />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <FiCalendar size={11} />
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
                    </span>
                    <RoleBadge role={u.role} />
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                    <select
                      value={u.role}
                      onChange={e => handleChangeRole(u._id, e.target.value)}
                      disabled={u._id === currentUser?._id || actionLoading}
                      className="flex-1 text-xs font-semibold px-2 py-2 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer focus:ring-2 focus:ring-violet-500 outline-none disabled:opacity-50"
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="INSTRUCTOR">INSTRUCTOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button
                      onClick={() => handleToggleStatus(u._id, u.isActive, `${u.firstName} ${u.lastName}`)}
                      disabled={u._id === currentUser?._id || actionLoading}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-40 ${
                        u.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      {u.isActive ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />}
                      {u.isActive ? "Deactivate" : "Activate"}
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

export default AdminUsers;
