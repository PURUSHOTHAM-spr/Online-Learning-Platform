import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";


function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  

 const handleLogin = async (e) => {
  e.preventDefault();

  try {

    const res = await axiosInstance.post("/common-api/login", form);

    console.log(res.data);

    alert(res.data.message);

    const user = res.data.payload;

    // save user
    localStorage.setItem("user", JSON.stringify(user));

    // role navigation
    if (user.role === "STUDENT") {
      navigate("/student/StudentDashboard");
    }

    if (user.role === "INSTRUCTOR") {
      navigate("/instructor/InstructorDashboard");
    }

  } catch (err) {
    console.log(err);
    alert("Login failed");
  }
};

  return (

    <div className="min-h-screen flex bg-gray-100">

      {/* LEFT LOGIN SECTION */}

      <div className="w-1/2 flex items-center justify-center bg-white">

        <div className="w-[420px]">

          <h1 className="text-4xl font-bold mb-2">
            Welcome back
          </h1>

          <p className="text-gray-500 mb-6">
            Please enter your details
          </p>


          {/* GOOGLE LOGIN */}

          <button className="w-full border p-3 rounded-lg flex items-center justify-center gap-3 mb-6 hover:bg-gray-50">

            <img
              src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
              className="w-5"
            />

            Sign in with Google

          </button>


          {/* DIVIDER */}

          <div className="flex items-center gap-4 mb-6">

            <div className="flex-1 h-[1px] bg-gray-300"></div>

            <span className="text-gray-400 text-sm">or</span>

            <div className="flex-1 h-[1px] bg-gray-300"></div>

          </div>


          {/* FORM */}

          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-5"
          >

            <div>
              <label className="text-sm text-gray-600">
                Email address
              </label>

              <input
                type="email"
                className="w-full border p-3 rounded-lg mt-1"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>


            <div>
              <label className="text-sm text-gray-600">
                Password
              </label>

              <input
                type="password"
                className="w-full border p-3 rounded-lg mt-1"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>


            {/* REMEMBER + FORGOT */}

            <div className="flex justify-between text-sm text-gray-500">

              <label className="flex gap-2 items-center">

                <input type="checkbox" />

                Remember for 30 days

              </label>

              <a href="#" className="text-blue-500">
                Forgot password
              </a>

            </div>


            {/* LOGIN BUTTON */}

            <button
              className="bg-black text-white py-3 rounded-lg hover:bg-gray-900"
            >
              Sign in
            </button>

          </form>


          <p className="text-center text-gray-500 mt-6">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-500"
            >
              Sign up
            </Link>

          </p>

        </div>

      </div>


      {/* RIGHT IMAGE SECTION */}

      <div className="w-1/2 relative">

        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/034/203/195/small/two-step-verification-concept-otp-authentication-password-one-time-password-for-secure-website-account-login-login-page-on-laptop-screen-flat-illustration-on-white-background-vector.jpg"
          className="w-full h-full object-cover"
        />


        {/* TEXT OVER IMAGE */}

        <div className="absolute bottom-10 left-10 text-white">

          <h2 className="text-3xl font-bold mb-2">
            Bring your ideas to life.
          </h2>

          <p className="max-w-sm text-sm">

            Sign up for free and enjoy access to all
            features for 30 days. No credit card required.

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;