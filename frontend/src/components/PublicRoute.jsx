import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    // Already logged in, redirect to dashboard based on role
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

export default PublicRoute;
