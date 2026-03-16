import React, { useState } from "react";

function LoginForm() {

  const [userData, setUserData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    // Email validation
    if (!userData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!userData.password) {
      newErrors.password = "Password is required";
    } else if (userData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form Submitted:", userData);
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 p-8 rounded-lg shadow-sm">

      <h2 className="text-2xl font-bold text-center mb-6">
        Login
      </h2>

      <form onSubmit={handleSubmit}>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#a435f0] text-sm"
            placeholder="Enter your email"
          />

          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#a435f0] text-sm"
            placeholder="Enter your password"
          />

          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#a435f0] text-white py-2 rounded font-semibold hover:bg-[#8710d8] transition"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default LoginForm;