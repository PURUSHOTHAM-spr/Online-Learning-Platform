import { Routes, Route } from "react-router-dom"
import RootLayout from "./layouts/RootLayout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import StudentDashboard from "./student/StudentDashboard"
import MyCourses from "./student/MyCourses"
import InstructorDashboard from "./instructor/InstructorDashboard"
import CreateCourse from "./instructor/CreateCourse"
import AdminDashboard from "./admin/AdminDashboard"
import ProtectedRoute from "./routes/ProtectedRoute"
import PublicRoute from "./routes/PublicRoute"

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

          {/* Protected Admin Routes */}
          <Route path="admin-dashboard" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

        </Route>

      </Routes>

  )
}

export default App