import { Routes, Route } from "react-router-dom"
import RootLayout from "./layouts/RootLayout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import StudentDashboard from "./student/StudentDashboard"
import MyCourses from "./student/MyCourses"
import InstructorDashboard from "./instructor/InstructorDashboard"
import CreateCourse from "./instructor/CreateCourse"
import InstructorMyCourses from "./instructor/InstructorMyCourses"
import InstructorReviews from "./instructor/InstructorReviews"
import AdminDashboard from "./admin/AdminDashboard"
import StudentProfile from "./student/StudentProfile"
import ProtectedRoute from "./routes/ProtectedRoute"
import PublicRoute from "./routes/PublicRoute"
import AllCourses from "./student/AllCourses"
import CourseDetails from "./student/CourseDetails"
import CourseContent from "./student/CourseContent"

function App() {
  return (

      <Routes>

        <Route path="/" element={<RootLayout />}>

          <Route index element={<Home />} />
          
          <Route path="login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Protected Student Routes */}
          <Route path="student-dashboard" element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="my-courses" element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <MyCourses />
            </ProtectedRoute>
          } />

          <Route path="all-courses" element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <AllCourses />
            </ProtectedRoute>
          } />

          <Route path="course/:courseId" element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <CourseDetails />
            </ProtectedRoute>
          } />

          <Route path="learn/:courseId" element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <CourseContent />
            </ProtectedRoute>
          } />

          {/* Protected Instructor Routes */}
          <Route path="instructor-dashboard" element={
            <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
              <InstructorDashboard />
            </ProtectedRoute>
          } />

          <Route path="create-course" element={
            <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
              <CreateCourse />
            </ProtectedRoute>
          } />

          <Route path="instructor-my-courses" element={
            <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
              <InstructorMyCourses />
            </ProtectedRoute>
          } />

          <Route path="instructor-reviews" element={
            <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
              <InstructorReviews />
            </ProtectedRoute>
          } />

          {/* Protected Admin Routes */}
          <Route path="admin-dashboard" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Profile - Student Only */}
          <Route path="profile" element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentProfile />
            </ProtectedRoute>
          } />

        </Route>

      </Routes>

  )
}

export default App