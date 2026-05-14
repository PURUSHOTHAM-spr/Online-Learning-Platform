import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome, FiUsers, FiBookOpen, FiBarChart2,
  FiSettings, FiLogOut, FiShield, FiMenu, FiX, FiChevronDown,
} from "react-icons/fi";

const NAV_ITEMS = [
  { icon: FiHome,      label: "Overview",  path: "/admin-dashboard" },
  { icon: FiUsers,     label: "Users",     path: "/admin/users" },
  { icon: FiBookOpen,  label: "Courses",   path: "/admin/courses" },
  { icon: FiBarChart2, label: "Analytics", path: "/admin/analytics" },
  { icon: FiSettings,  label: "Settings",  path: "/admin/settings" },
];

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user") || "{}");

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col">

      {/* ══════════════════════════════════════════
           TOP NAVBAR
      ══════════════════════════════════════════ */}
      <header className="bg-[#0F172A] text-white sticky top-0 z-50 shadow-xl shadow-black/20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-6">

            {/* ── Brand ── */}
            <Link to="/admin-dashboard" className="flex items-center gap-2.5 shrink-0 mr-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
                <FiShield size={15} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent leading-none">
                  CourseHub
                </span>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-medium -mt-0.5">Admin Panel</p>
              </div>
            </Link>

            {/* ── Divider ── */}
            <div className="hidden lg:block w-px h-6 bg-slate-700" />

            {/* ── Desktop Nav links ── */}
            <nav className="hidden lg:flex items-center gap-1 flex-1">
              {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
                const isActive =
                  location.pathname === path ||
                  (path !== "/admin-dashboard" && location.pathname.startsWith(path));

                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all
                      ${isActive
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      }`}
                  >
                    <Icon size={15} className="shrink-0" />
                    {label}
                    {isActive && (
                      <span className="w-1 h-1 rounded-full bg-white/70 ml-0.5" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Spacer (mobile) ── */}
            <div className="flex-1 lg:hidden" />

            {/* ── Profile dropdown ── */}
            <div className="relative shrink-0">
              <button
                id="admin-profile-menu"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow shrink-0">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-slate-200 leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Administrator</p>
                </div>
                <FiChevronDown
                  size={14}
                  className={`hidden sm:block text-slate-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <>
                  {/* Click-outside overlay */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[#1E293B] rounded-2xl shadow-2xl border border-slate-700/50 py-2 z-50 overflow-hidden">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-slate-700/50">
                      <p className="text-sm font-bold text-slate-200">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{user?.email}</p>
                    </div>

                    {/* Dropdown nav items (mobile only — full nav shown on desktop) */}
                    <div className="lg:hidden py-1 border-b border-slate-700/50">
                      {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
                        const isActive = location.pathname === path ||
                          (path !== "/admin-dashboard" && location.pathname.startsWith(path));
                        return (
                          <Link
                            key={path}
                            to={path}
                            onClick={() => setProfileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                              isActive
                                ? "text-violet-400 bg-violet-500/10 font-semibold"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                            }`}
                          >
                            <Icon size={15} />
                            {label}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Logout */}
                    <div className="py-1">
                      <button
                        onClick={() => { setProfileOpen(false); handleLogout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                      >
                        <FiLogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ── Mobile hamburger (opens full-screen nav) ── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown nav ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-700/50 bg-[#0F172A] px-4 py-3 space-y-1">
            {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
              const isActive =
                location.pathname === path ||
                (path !== "/admin-dashboard" && location.pathname.startsWith(path));
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow shadow-violet-900/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
            >
              <FiLogOut size={16} />
              Sign Out
            </button>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════
           PAGE CONTENT
      ══════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
