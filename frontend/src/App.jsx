import { Routes, Route } from "react-router-dom"
import RootLayout from "./layouts/RootLayout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import StudentDashboard from "./student/StudentDashboard"
import InstructorDashboard from "./instructor/InstructorDashboard"

function App() {
  return (

      <Routes>

        <Route path="/" element={<RootLayout />}>

          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="student/StudentDashboard" element={<StudentDashboard />} />
          <Route path="instructor/InstructorDashboard" element={<InstructorDashboard />} />

        </Route>

      </Routes>

  )
}

export default App