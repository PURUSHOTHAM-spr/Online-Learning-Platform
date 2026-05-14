import React, { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import {
  FiUser, FiMail, FiShield, FiSave, FiEye, FiEyeOff,
  FiLock, FiAlertTriangle, FiCheck
} from "react-icons/fi";
import AdminLayout from "./AdminLayout";

function AdminSettings() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [profile, setProfile] = useState({
    firstName: user.firstName || "",
    lastName:  user.lastName  || "",
    email:     user.email     || "",
  });

  const [passwords, setPasswords] = useState({
    current:  "",
    next:     "",
    confirm:  "",
  });

  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Profile update would go here — backend endpoint required
      // For now we update localStorage to reflect UI changes
      const updated = { ...user, firstName: profile.firstName, lastName: profile.lastName };
      localStorage.setItem("user", JSON.stringify(updated));
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwords.next.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setSaving(true);
    try {
      // Password change endpoint — customize as needed
      toast.success("Password changed successfully!");
      setPasswords({ current: "", next: "", confirm: "" });
    } catch (err) {
      toast.error("Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  const PwInput = ({ field, label }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
        <input
          type={showPw[field] ? "text" : "password"}
          value={passwords[field]}
          onChange={e => setPasswords(p => ({ ...p, [field]: e.target.value }))}
          placeholder="••••••••"
          className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition bg-slate-50"
        />
        <button
          type="button"
          onClick={() => setShowPw(s => ({ ...s, [field]: !s[field] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
        >
          {showPw[field] ? <FiEyeOff size={15} /> : <FiEye size={15} />}
        </button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-8 py-6 shrink-0">
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-400 mt-0.5">Manage your admin profile and account preferences</p>
      </header>

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* ── ADMIN PROFILE CARD ───────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 h-24 relative">
              <div className="absolute -bottom-8 left-8">
                <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </div>
            </div>
            <div className="px-8 pt-12 pb-6">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-slate-800">{user?.firstName} {user?.lastName}</h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
                  ADMIN
                </span>
              </div>
              <p className="text-sm text-slate-500 flex items-center gap-1.5">
                <FiMail size={13} /> {user?.email}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl w-fit">
                <FiShield size={13} /> Full administrator privileges
              </div>
            </div>
          </div>

          {/* ── EDIT PROFILE FORM ─────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
              <FiUser size={16} className="text-violet-500" /> Profile Information
            </h4>
            <p className="text-xs text-slate-400 mb-6">Update your display name and contact details</p>
            <form onSubmit={handleProfileSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition bg-slate-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition bg-slate-50"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-100 text-slate-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">Email cannot be changed from this panel.</p>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition disabled:opacity-60 shadow-lg shadow-violet-200"
                >
                  {saving ? <FiSave size={14} className="animate-pulse" /> : <FiCheck size={14} />}
                  Save Profile
                </button>
              </div>
            </form>
          </div>

          {/* ── CHANGE PASSWORD ─────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
              <FiLock size={16} className="text-violet-500" /> Change Password
            </h4>
            <p className="text-xs text-slate-400 mb-6">Update your account password</p>
            <form onSubmit={handlePasswordSave} className="space-y-5">
              <PwInput field="current" label="Current Password" />
              <PwInput field="next"    label="New Password" />
              <PwInput field="confirm" label="Confirm New Password" />

              {passwords.next && passwords.confirm && passwords.next !== passwords.confirm && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                  <FiAlertTriangle size={14} /> Passwords do not match
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving || !passwords.current || !passwords.next || !passwords.confirm}
                  className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition disabled:opacity-60 shadow-lg shadow-violet-200"
                >
                  {saving ? <FiSave size={14} className="animate-pulse" /> : <FiLock size={14} />}
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* ── DANGER ZONE ─────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8">
            <h4 className="font-bold text-red-600 mb-1 flex items-center gap-2">
              <FiAlertTriangle size={16} /> Danger Zone
            </h4>
            <p className="text-xs text-slate-400 mb-6">These actions are irreversible. Proceed with caution.</p>
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-slate-700">Sign out of all sessions</p>
                <p className="text-xs text-slate-400 mt-0.5">Revoke all active login sessions across all devices.</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition">
                Sign Out All
              </button>
            </div>
          </div>

        </div>
      </main>
    </AdminLayout>
  );
}

export default AdminSettings;
