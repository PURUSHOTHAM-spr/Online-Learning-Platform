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
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
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

          {user && user.role === "STUDENT" && (
            <NavLink
              to="/all-courses"
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-violet-600"
                    : "text-gray-700 hover:text-violet-600"
                }`
              }
            >
              All Courses
            </NavLink>
          )}

          {user && user.role === "STUDENT" && (
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
          )}

          {user && user.role === "INSTRUCTOR" && (
            <>
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
              <NavLink
                to="/instructor-my-courses"
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
                to="/instructor-reviews"
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive
                      ? "text-violet-600"
                      : "text-gray-700 hover:text-violet-600"
                  }`
                }
              >
                Reviews
              </NavLink>
            </>
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
            <div className="flex items-center gap-3">
              <NavLink
                to="/profile"
                title={`${user.firstName} ${user.lastName}`}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "bg-violet-100 text-violet-700"
                      : "text-gray-700 hover:bg-violet-50 hover:text-violet-700"
                  }`
                }
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <span className="hidden sm:block">{user.firstName}</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;