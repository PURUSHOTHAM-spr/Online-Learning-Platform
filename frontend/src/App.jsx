import { Routes, Route } from "react-router-dom"
import RootLayout from "./layouts/RootLayout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import StudentDashboard from "./student/StudentDashboard"
import InstructorDashboard from "./instructor/InstructorDashboard"
import AdminDashboard from "./admin/AdminDashboard"

function App() {
  return (

      <Routes>

        <Route path="/" element={<RootLayout />}>

          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="student-dashboard" element={<StudentDashboard />} />
          <Route path="instructor-dashboard" element={<InstructorDashboard />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />

        </Route>

      </Routes>

  )
}

export default App