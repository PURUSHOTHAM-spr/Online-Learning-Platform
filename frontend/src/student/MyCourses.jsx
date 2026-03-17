import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { Link } from "react-router-dom";

function MyCourses() {

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {

    try {

      const res = await axiosInstance.get("/user-api/my-courses");

      setCourses(res.data.payload);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        My Courses
      </h1>

      {courses.length === 0 ? (

        <p>No enrolled courses</p>

      ) : (

        <div className="grid grid-cols-3 gap-6">

          {courses.map(course => (

            <div
              key={course._id}
              className="border rounded p-4 shadow"
            >

              <h2 className="text-xl font-bold">
                {course.title}
              </h2>

              <p className="text-gray-600">
                {course.description}
              </p>

              <p className="text-sm mt-2">
                Category: {course.category}
              </p>

              <p className="text-sm">
                Level: {course.courseLevel}
              </p>

              <Link
                to={`/course/${course._id}`}
                className="inline-block mt-3 bg-blue-500 text-white px-3 py-1 rounded"
              >
                Continue Learning
              </Link>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}

export default MyCourses;