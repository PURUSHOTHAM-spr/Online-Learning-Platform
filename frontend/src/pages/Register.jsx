import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff,
  FiBookOpen, FiAward, FiUsers, FiShield, FiKey,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

// ─── Secret admin key (change this to match your backend config) ──
const ADMIN_SECRET_KEY = "COURSEHUB_ADMIN_2024";

const ROLE_OPTIONS = [
  {
    value: "STUDENT",
    label: "Learn",
    sub: "Access courses",
    icon: FiBookOpen,
    border: "border-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  {
    value: "INSTRUCTOR",
    label: "Teach",
    sub: "Create & sell courses",
    icon: FiUsers,
    border: "border-violet-500",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
  {
    value: "ADMIN",
    label: "Admin",
    sub: "Platform management",
    icon: FiShield,
    border: "border-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
  },
];

const PANEL_CONTENT = {
  STUDENT: {
    heading: ["Everything you need to grow your", "skills"],
    sub: "Join thousands of learners and instructors on CourseHub — the platform built for real career outcomes.",
    color: "#60a5fa",
    blobColor: "rgba(59,130,246,0.12)",
    iconColor: "text-blue-500",
    benefits: [
      { icon: FiBookOpen, text: "Access 1,200+ expert-led courses" },
      { icon: FiAward,    text: "Earn certificates on completion" },
      { icon: FiUsers,    text: "Join a community of 50K+ learners" },
    ],
    headerIcon: null,
  },
  INSTRUCTOR: {
    heading: ["Share your expertise with the", "world"],
    sub: "Build and publish courses, grow a student base, and earn revenue doing what you love.",
    color: "#a78bfa",
    blobColor: "rgba(139,92,246,0.12)",
    iconColor: "text-violet-500",
    benefits: [
      { icon: FiBookOpen, text: "Publish unlimited courses" },
      { icon: FiAward,    text: "Earn from every enrollment" },
      { icon: FiUsers,    text: "Reach 50K+ active learners" },
    ],
    headerIcon: FiUsers,
  },
  ADMIN: {
    heading: ["Take full control of the", "platform"],
    sub: "Admin accounts have full access to manage users, courses, and platform-wide analytics.",
    color: "#f87171",
    blobColor: "rgba(239,68,68,0.12)",
    iconColor: "text-red-500",
    benefits: [
      { icon: FiShield,   text: "Full user & course management" },
      { icon: FiAward,    text: "Platform-wide analytics access" },
      { icon: FiUsers,    text: "Control roles & permissions" },
    ],
    headerIcon: FiShield,
  },
};

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminKey, setShowAdminKey]  = useState(false);
  const [adminKey, setAdminKey]          = useState("");
  const [isLoading, setIsLoading]        = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { role: "STUDENT" } });

  const selectedRole = watch("role");
  const password     = watch("password", "");
  const panel        = PANEL_CONTENT[selectedRole] || PANEL_CONTENT.STUDENT;

  const strength =
    password.length === 0 ? 0 :
    password.length < 6   ? 1 :
    password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8 ? 3 : 2;
  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-green-500"];

  const onSubmit = async (data) => {
    if (data.role === "ADMIN") {
      if (!adminKey.trim()) {
        toast.error("Please enter the admin secret key.");
        return;
      }
      if (adminKey.trim() !== ADMIN_SECRET_KEY) {
        toast.error("Invalid admin secret key. Contact your system administrator.");
        return;
      }
    }

    setIsLoading(true);
    try {
      const payload = { ...data, email: data.email?.trim().toLowerCase() };
      const res = await axiosInstance.post("/common-api/register", payload);
      toast.success(res.data.message || "Account created successfully!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitBg =
    selectedRole === "ADMIN"      ? "bg-red-600    hover:bg-red-700    shadow-red-200" :
    selectedRole === "INSTRUCTOR" ? "bg-violet-600 hover:bg-violet-700 shadow-violet-200" :
                                    "bg-blue-600   hover:bg-blue-700   shadow-blue-200";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-4 lg:p-0">
      <div className="flex h-auto w-full max-w-[1100px] overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* ══════════════════════════════════════
             LEFT — FORM
        ══════════════════════════════════════ */}
        <div className="flex w-full flex-col justify-center px-8 py-10 lg:w-1/2 lg:px-14">

          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-violet-600">Create account</h1>
            <p className="mt-2 text-slate-500">Start your journey on CourseHub today</p>
          </div>

          {/* Google signup — hidden for admin */}
          {selectedRole !== "ADMIN" && (
            <>
              <button
                type="button"
                className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl border border-[#e2e8f0] py-3 font-medium text-[#475569] transition hover:bg-[#f1f5f9]"
              >
                <FcGoogle size={22} />
                Sign up with Google
              </button>
              <div className="relative mb-5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e2e8f0]" />
                </div>
                <span className="relative bg-white px-4 text-sm text-[#94a3b8]">
                  or register with email
                </span>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Names */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] transition group-focus-within:text-[#3b82f6]" />
                  <input
                    type="text"
                    placeholder="First name"
                    {...register("firstName", { required: "Required" })}
                    className={`w-full rounded-xl border bg-[#f8fafc] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 ${errors.firstName ? "border-red-400" : "border-[#e2e8f0]"}`}
                  />
                </div>
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
              </div>

              <div>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] transition group-focus-within:text-[#3b82f6]" />
                  <input
                    type="text"
                    placeholder="Last name"
                    {...register("lastName", { required: "Required" })}
                    className={`w-full rounded-xl border bg-[#f8fafc] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 ${errors.lastName ? "border-red-400" : "border-[#e2e8f0]"}`}
                  />
                </div>
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] transition group-focus-within:text-[#3b82f6]" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" },
                  })}
                  className={`w-full rounded-xl border bg-[#f8fafc] py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 ${errors.email ? "border-red-400" : "border-[#e2e8f0]"}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] transition group-focus-within:text-[#3b82f6]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                  className={`w-full rounded-xl border bg-[#f8fafc] py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 ${errors.password ? "border-red-400" : "border-[#e2e8f0]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] transition hover:text-[#475569]"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`h-1.5 flex-1 rounded-full transition-all ${s <= strength ? strengthColor[strength] : "bg-[#e2e8f0]"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-[#64748b]">{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            {/* ── ROLE SELECTOR ── */}
            <div>
              <p className="mb-2 text-sm font-semibold text-[#475569]">I want to</p>
              <div className="grid grid-cols-3 gap-2">
                {ROLE_OPTIONS.map(({ value, label, sub, icon: Icon, bg, border, text }) => {
                  const checked = selectedRole === value;
                  return (
                    <label
                      key={value}
                      className={`flex cursor-pointer flex-col items-center rounded-xl border-2 p-3 text-center transition ${
                        checked ? `${border} ${bg}` : "border-[#e2e8f0] hover:border-[#c0cadc]"
                      }`}
                    >
                      <input type="radio" value={value} {...register("role")} className="sr-only" />
                      <Icon size={18} className={`mb-1 ${checked ? text : "text-slate-400"}`} />
                      <span className={`text-sm font-bold ${checked ? text : "text-[#2d2f31]"}`}>{label}</span>
                      <span className="mt-0.5 text-[10px] text-[#6a6f73] leading-tight">{sub}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* ── ADMIN SECRET KEY (only when ADMIN selected) ── */}
            {selectedRole === "ADMIN" && (
              <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-red-700">
                  <FiShield size={14} />
                  <p className="text-xs font-bold uppercase tracking-wider">Admin Authorization Required</p>
                </div>
                <p className="text-xs text-red-600 leading-relaxed">
                  Creating an admin account requires a secret authorization key.
                  Contact your system administrator to obtain it.
                </p>
                <div className="relative group">
                  <FiKey
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 transition group-focus-within:text-red-600"
                  />
                  <input
                    type={showAdminKey ? "text" : "password"}
                    placeholder="Enter admin secret key"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="w-full rounded-xl border-2 border-red-200 bg-white py-3 pl-11 pr-12 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 placeholder:text-red-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminKey(!showAdminKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-red-300 hover:text-red-500 transition"
                  >
                    {showAdminKey ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              id="register-submit-btn"
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white shadow-lg transition active:scale-[0.98] ${submitBg} ${isLoading ? "cursor-not-allowed opacity-70" : ""}`}
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  {selectedRole === "ADMIN" && <FiShield size={16} />}
                  {selectedRole === "ADMIN" ? "Create Admin Account" : "Create free account"}
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#64748b]">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#3b82f6] hover:underline decoration-2">
              Log in
            </Link>
          </p>
        </div>

        {/* ══════════════════════════════════════
             RIGHT — VISUAL PANEL (adapts to role)
        ══════════════════════════════════════ */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#1e293b] p-12 lg:flex lg:w-1/2">
          {/* Animated blobs */}
          <div
            className="absolute -right-12 -top-12 h-56 w-56 rounded-full blur-3xl transition-all duration-700"
            style={{ background: panel.blobColor }}
          />
          <div
            className="absolute -bottom-10 left-10 h-48 w-48 rounded-full blur-3xl animate-pulse transition-all duration-700"
            style={{ background: panel.blobColor }}
          />

          <div className="relative z-10">
            {/* Icon */}
            <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-xl">
              {panel.headerIcon ? (
                <panel.headerIcon size={22} className={panel.iconColor} />
              ) : (
                <div className="h-6 w-6 rounded-md bg-[#3b82f6]" />
              )}
            </div>

            <h2 className="mb-4 text-3xl font-bold leading-tight text-white">
              {panel.heading[0]}{" "}
              <span style={{ color: panel.color }}>{panel.heading[1]}.</span>
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-[#94a3b8]">
              {panel.sub}
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            {panel.benefits.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ background: `${panel.blobColor.replace("0.12", "0.25")}` }}
                >
                  <Icon size={16} style={{ color: panel.color }} />
                </div>
                <span className="text-sm font-medium text-[#cbd5e1]">{text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;