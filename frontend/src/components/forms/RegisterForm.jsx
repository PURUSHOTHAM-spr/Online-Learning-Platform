import React, { useState } from "react";

function RegisterForm() {

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    profileImageUrl: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!userData.firstName)
      newErrors.firstName = "First name is required";

    if (!userData.lastName)
      newErrors.lastName = "Last name is required";

    if (!userData.email)
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(userData.email))
      newErrors.email = "Invalid email format";

    if (!userData.password)
      newErrors.password = "Password is required";
    else if (userData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!userData.role)
      newErrors.role = "Please select a role";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      console.log("Registered User:", userData);
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 px-20  py-5 rounded-lg shadow-sm">

      <h2 className="text-2xl font-bold text-center mb-6">
        Register
      </h2>

      <form onSubmit={handleSubmit}>

        {/* First Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleChange}
            className="w-full border px-5 py-2 rounded"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
            className="w-full border px-5 py-2 rounded"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full border px-5 py-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="w-full border px-5 py-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Role
          </label>
          <select
            name="role"
            value={userData.role}
            onChange={handleChange}
            className="w-full border px-5 py-2 rounded"
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>

          {errors.role && (
            <p className="text-red-500 text-xs">{errors.role}</p>
          )}
        </div>

        {/* Profile Image URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Profile Image URL
          </label>
          <input
            type="text"
            name="profileImageUrl"
            value={userData.profileImageUrl}
            onChange={handleChange}
            className="w-full border px-5 py-2 rounded"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#a435f0] text-white py-2 rounded font-semibold hover:bg-[#8710d8]"
        >
          Register
        </button>

      </form>
    </div>
  );
}

export default RegisterForm;