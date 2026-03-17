import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to their own dashboard
    if (user.role === "STUDENT") {
      return <Navigate to="/student-dashboard" replace />;
    } else if (user.role === "INSTRUCTOR") {
      return <Navigate to="/instructor-dashboard" replace />;
    } else if (user.role === "ADMIN") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
