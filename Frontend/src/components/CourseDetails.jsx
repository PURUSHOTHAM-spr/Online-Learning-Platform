import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

function CourseDetails() {

  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await axiosInstance.get(`/instructor-api/course/${id}`);
      setCourse(res.data.payload);
    } catch (err) {
      console.log(err);
    }
  };

  if (!course) {
    return <p className="p-8">Loading...</p>;
  }

  return (

    <div className="bg-gray-100 min-h-screen">

      {/* HERO SECTION */}
      <div className="bg-[#1c1d1f] text-white p-10">

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

          {/* LEFT SIDE */}
          <div>

            <p className="text-sm text-purple-400">
              {course.category}
            </p>

            <h1 className="text-3xl font-bold mt-2">
              {course.title}
            </h1>

            <p className="mt-4 text-gray-300">
              {course.description}
            </p>

            <p className="mt-4 text-sm">
              Created by <span className="text-purple-400">{course.instructorName || "Instructor"}</span>
            </p>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-yellow-400 font-bold">4.5</span>
              <span className="text-yellow-400">★★★★★</span>
              <span className="text-gray-400">(230 ratings)</span>
            </div>

          </div>

          {/* RIGHT SIDE (VIDEO + PRICE CARD) */}
          <div className="bg-white text-black rounded shadow overflow-hidden">

            <img
              src={
                course.imageUrl ||
                "https://img.freepik.com/free-photo/programming-background-collage_23-2149901789.jpg"
              }
              className="w-full h-48 object-cover"
            />

            <div className="p-4">

              <h2 className="text-2xl font-bold">
                ₹{course.price || 499}
              </h2>

              <button className="w-full bg-purple-600 text-white py-2 rounded mt-4">
                Enroll Now
              </button>

              <p className="text-sm text-gray-500 mt-2 text-center">
                30-Day Money-Back Guarantee
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* COURSE CONTENT */}
      <div className="max-w-6xl mx-auto p-8">

        <h2 className="text-2xl font-bold mb-4">
          What you'll learn
        </h2>

        <ul className="grid grid-cols-2 gap-3 text-gray-700">
          <li>✔ Build real-world projects</li>
          <li>✔ Understand core concepts</li>
          <li>✔ Hands-on practice</li>
          <li>✔ Industry-level skills</li>
        </ul>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">
            Course Details
          </h2>

          <p><strong>Level:</strong> {course.courseLevel}</p>
          <p><strong>Students:</strong> {course.studentsEnrolled || 0}</p>
          <p><strong>Status:</strong> {course.isActive ? "Active" : "Inactive"}</p>
        </div>

      </div>

    </div>
  );
}

export default CourseDetails;