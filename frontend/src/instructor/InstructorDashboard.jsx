import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { Link } from "react-router-dom";

function InstructorDashboard() {

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/instructor-api/my-courses");
      setCourses(res.data.payload);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      await axiosInstance.delete(`/instructor-api/delete-course/${courseId}`);
      alert("Course deleted");
      fetchCourses();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Instructor Dashboard
        </h1>

        <Link
          to="/create-course"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

        <div className="bg-gray-100 p-6 rounded shadow">
          <h2 className="text-lg">Total Courses</h2>
          <p className="text-2xl font-bold">{courses.length}</p>
        </div>

        <div className="bg-gray-100 p-6 rounded shadow">
          <h2 className="text-lg">Total Students</h2>
          <p className="text-2xl font-bold">
            {courses.reduce((acc, c) => acc + c.studentsEnrolled, 0)}
          </p>
        </div>

        <div className="bg-gray-100 p-6 rounded shadow">
          <h2 className="text-lg">Active Courses</h2>
          <p className="text-2xl font-bold">
            {courses.filter(c => c.isActive).length}
          </p>
        </div>

      </div>

      {/* Courses List */}
      <h2 className="text-xl font-semibold mb-4">
        My Courses
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {courses.map((course) => (

          <div
            key={course._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border"
          >

            {/* Thumbnail */}
            <div className="relative">
              <img
                src={course.thumbnail || "https://via.placeholder.com/300"}
                alt="course"
                className="w-full h-44 object-cover"
              />

              <span className="absolute top-2 left-2 bg-violet-600 text-white text-xs px-2 py-1 rounded">
                {course.courseLevel}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">

              <h3 className="text-lg font-semibold line-clamp-1">
                {course.title}
              </h3>

              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {course.description}
              </p>

              {/* Stats */}
              <div className="flex justify-between text-sm text-gray-600 mt-3">
                <span> {course.studentsEnrolled} Students</span>
                <span className={course.isActive ? "text-green-600" : "text-red-500"}>
                  {course.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-4">

                <Link
                  to={`/course/${course._id}`}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 rounded text-sm text-center"
                >
                  View
                </Link>

                <Link
                  to={`/update-course/${course._id}`}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded text-sm text-center"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteCourse(course._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded text-sm"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default InstructorDashboard;