import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentDashboard from './pages/student/StudentDashboard'
import InstructorDashboard from './pages/instructor/InstructorDashboard'
import RootLayout from './layouts/RootLayout'

function App() {

  const routerObj = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          path: "",
          element: <Home />
        },
        {
          path: "login",
          element: <Login />
        },
        {
          path: "register",
          element: <Register />
        },
        {
          path: "admin-dashboard",
          element: <AdminDashboard />
        },
        {
          path: "student-dashboard",
          element: <StudentDashboard />
        },
        {
          path: "instructor-dashboard",
          element: <InstructorDashboard />
        }
      ]
    }
  ])

  return <RouterProvider router={routerObj} />
}

export default App