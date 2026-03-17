import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold text-violet-600 hover:text-violet-500 transition"
        >
          CourseHub
        </NavLink>

        {/* Links */}
        <div className="flex items-center gap-6">

          <NavLink
            to="/my-courses"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-violet-600"
                  : "text-gray-700 hover:text-violet-600"
              }`
            }
          >
            My Courses
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-violet-600"
                  : "text-gray-700 hover:text-violet-600"
              }`
            }
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-500 transition"
          >
            Register
          </NavLink>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;