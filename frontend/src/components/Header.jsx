import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

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
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-violet-600"
                  : "text-gray-700 hover:text-violet-600"
              }`
            }
          >
            Home
          </NavLink>

          {user && user.role === "STUDENT" && (
            <NavLink
              to="/student-dashboard"
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-violet-600"
                    : "text-gray-700 hover:text-violet-600"
                }`
              }
            >
              My Dashboard
            </NavLink>
          )}

          {user && user.role === "INSTRUCTOR" && (
            <NavLink
              to="/instructor-dashboard"
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-violet-600"
                    : "text-gray-700 hover:text-violet-600"
                }`
              }
            >
              Instructor Panel
            </NavLink>
          )}

          {user && user.role === "ADMIN" && (
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-violet-600"
                    : "text-gray-700 hover:text-violet-600"
                }`
              }
            >
              Admin Panel
            </NavLink>
          )}

          {!user ? (
            <>
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
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;