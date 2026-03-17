import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        email: data.email?.trim().toLowerCase(),
      };

      const res = await axiosInstance.post("/common-api/login", payload);
      
      toast.success(res.data.message || "Login successful!");
      const user = res.data.payload;

      // Save user to local storage
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based navigation
      setTimeout(() => {
        if (user.role === "STUDENT") {
          navigate("/student-dashboard");
        } else if (user.role === "INSTRUCTOR") {
          navigate("/instructor-dashboard");
        } else if (user.role === "ADMIN") {
          navigate("/admin-dashboard");
        }
      }, 1000);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 lg:p-0">
      <div className="flex w-full max-w-[1100px] h-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* LEFT SECTION: FORM */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-[#1e293b] mb-3">Welcome Back</h1>
            <p className="text-[#64748b]">Enter your credentials to access your account</p>
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-3 border border-[#e2e8f0] rounded-xl hover:bg-[#f1f5f9] transition-all duration-300 mb-8 font-medium text-[#475569]">
            <FcGoogle size={22} />
            Sign in with Google
          </button>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e2e8f0]"></div>
            </div>
            <span className="relative px-4 bg-white text-[#94a3b8] text-sm">or login with email</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#475569] block">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within:text-[#3b82f6] transition-colors" />
                <input
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className={`w-full pl-12 pr-4 py-3.5 bg-[#f8fafc] border ${errors.email ? 'border-red-500' : 'border-[#e2e8f0]'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-[#475569]">Password</label>
                <Link to="/forgot-password" size="sm" className="text-sm font-semibold text-[#3b82f6] hover:text-[#2563eb] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within:text-[#3b82f6] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" }
                  })}
                  className={`w-full pl-12 pr-12 py-3.5 bg-[#f8fafc] border ${errors.password ? 'border-red-500' : 'border-[#e2e8f0]'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 text-white bg-[#1e293b] rounded-xl font-bold text-lg shadow-lg hover:bg-[#0f172a] transform active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[#64748b]">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-[#3b82f6] hover:underline decoration-2">
              Create an account
            </Link>
          </p>
        </div>

        {/* RIGHT SECTION: VISUALS */}
        <div className="hidden lg:flex w-1/2 bg-[#1e293b] p-12 flex-col justify-between relative overflow-hidden">
          {/* Animated Circles for background decoration */}
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#3b82f6]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#3b82f6]/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-12 shadow-xl shrink-0">
               <div className="w-6 h-6 bg-[#3b82f6] rounded-md"></div>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
              Empower your future through <span className="text-[#3b82f6]">Online Learning</span>.
            </h2>
            <p className="text-[#94a3b8] text-lg max-w-md leading-relaxed">
              Join thousands of students and masters in a platform designed to make learning intuitive, beautiful, and efficient.
            </p>
          </div>

          <div className="relative z-10 bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 mt-auto">
             <div className="flex items-center gap-4 mb-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img 
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-[#1e293b]" 
                      src={`https://i.pravatar.cc/100?u=${i}`} 
                      alt="avatar" 
                    />
                  ))}
                  <div className="w-10 h-10 rounded-full bg-[#3b82f6] border-2 border-[#1e293b] flex items-center justify-center text-xs font-bold text-white">
                    +10k
                  </div>
                </div>
                <p className="text-sm font-medium text-white">Joined the community</p>
             </div>
             <p className="text-[#94a3b8] text-sm font-medium">
               "The best platform I've ever used. The UI is stunning and the instructors are top-notch."
             </p>
             <div className="mt-4 flex items-center gap-2">
                <div className="flex text-yellow-500">
                  {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                </div>
                <span className="text-white text-sm font-bold">5.0</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
