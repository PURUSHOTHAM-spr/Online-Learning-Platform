
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

/* common components */
import Navbar from "./components/common/NavBar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

/* pages */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseDetails from "./pages/CourseDetails";
import SearchCourses from "./pages/SearchCourses";

/* student pages */
import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/MyCourses";
import CoursePlayer from "./pages/student/CoursePlayer";

/* instructor pages */
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import CreateCourse from "./pages/instructor/CreateCourse";
import ManageCourses from "./pages/instructor/ManageCourses";

/* admin pages */
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";

/* layout */
const RootLayout = () => (
  <>
    <Navbar />
    <div className="min-h-screen">
      <Outlet />
    </div>
    <Footer />
  </>
);

import { Outlet } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },

        { path: "course/:id", element: <CourseDetails /> },
        { path: "search", element: <SearchCourses /> },

        /* student routes */
        {
          path: "student/dashboard",
          element: (
            <ProtectedRoute role="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "student/my-courses",
          element: (
            <ProtectedRoute role="STUDENT">
              <MyCourses />
            </ProtectedRoute>
          ),
        },
        {
          path: "student/course/:id",
          element: (
            <ProtectedRoute role="STUDENT">
              <CoursePlayer />
            </ProtectedRoute>
          ),
        },

        /* instructor routes */
        {
          path: "instructor/dashboard",
          element: (
            <ProtectedRoute role="INSTRUCTOR">
              <InstructorDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "instructor/create-course",
          element: (
            <ProtectedRoute role="INSTRUCTOR">
              <CreateCourse />
            </ProtectedRoute>
          ),
        },
        {
          path: "instructor/manage-courses",
          element: (
            <ProtectedRoute role="INSTRUCTOR">
              <ManageCourses />
            </ProtectedRoute>
          ),
        },

        /* admin routes */
        {
          path: "admin/dashboard",
          element: (
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/manage-users",
          element: (
            <ProtectedRoute role="ADMIN">
              <ManageUsers />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;

