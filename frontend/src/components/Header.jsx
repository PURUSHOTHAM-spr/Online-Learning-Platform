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
    <header className="sticky top-0 z-50 border-b border-[#e9eaf2] bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-325 items-center gap-4 px-4 py-3 lg:px-8">
        <NavLink
          to="/"
          className="shrink-0 text-2xl font-black tracking-tight text-[#121212]"
        >
          CourseHub
        </NavLink>

        <button className="hidden shrink-0 text-sm font-medium text-[#2d2f31] transition hover:text-[#0f7c90] lg:block">
          Categories
        </button>

        <div className="hidden flex-1 rounded-full border border-[#c8c9d1] bg-[#f7f9fa] px-4 py-2 lg:flex">
          <input
            type="text"
            placeholder="Search for anything"
            className="w-full bg-transparent text-sm text-[#1c1d1f] outline-none placeholder:text-[#6a6f73]"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? "text-[#0f7c90]" : "text-[#2d2f31] hover:text-[#0f7c90]"}`
            }
          >
            Home
          </NavLink>

          {user && user.role === "STUDENT" && (
            <NavLink
              to="/student-dashboard"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-[#0f7c90]" : "text-[#2d2f31] hover:text-[#0f7c90]"}`
              }
            >
              My Learning
            </NavLink>
          )}

          {user && user.role === "INSTRUCTOR" && (
            <NavLink
              to="/instructor-dashboard"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-[#0f7c90]" : "text-[#2d2f31] hover:text-[#0f7c90]"}`
              }
            >
              Teach
            </NavLink>
          )}

          {user && user.role === "ADMIN" && (
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-[#0f7c90]" : "text-[#2d2f31] hover:text-[#0f7c90]"}`
              }
            >
              Admin
            </NavLink>
          )}

          {!user ? (
            <>
              <NavLink
                to="/login"
                className="rounded border border-[#1c1d1f] px-4 py-2 text-sm font-bold text-[#1c1d1f] transition hover:bg-[#f7f9fa]"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="rounded bg-[#1c1d1f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0b0c0d]"
              >
                Sign up
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded bg-[#f04438] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#d92d20]"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;