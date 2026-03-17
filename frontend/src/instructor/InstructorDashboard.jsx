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
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Course
        </Link>

      </div>


      {/* Stats */}

      <div className="grid grid-cols-3 gap-6 mb-10">

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

      <div className="grid grid-cols-3 gap-6">

        {courses.map(course => (

          <div
            key={course._id}
            className="border p-4 rounded shadow"
          >

            <h3 className="text-lg font-bold">
              {course.title}
            </h3>

            <p className="text-gray-600">
              {course.description}
            </p>

            <p className="text-sm mt-2">
              Students: {course.studentsEnrolled}
            </p>

            <p className="text-sm">
              Level: {course.courseLevel}
            </p>

            <div className="flex gap-3 mt-4">

              <Link
                to={`/course/${course._id}`}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                View
              </Link>

              <Link
                to={`/update-course/${course._id}`}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </Link>

              <button
                onClick={() => deleteCourse(course._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}

export default InstructorDashboard;