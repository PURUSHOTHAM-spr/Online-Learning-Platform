import { useNavigate } from "react-router-dom";

function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/course/${course._id}`)}
      className="cursor-pointer bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden"
    >
      <img
        src={
          course?.imageUrl ||
          "https://img.freepik.com/free-photo/programming-background-collage_23-2149901789.jpg"
        }
        alt="course"
        className="h-40 w-full object-cover"
      />

      <div className="p-4">

        <h3 className="font-semibold text-lg line-clamp-2">
          {course.title}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {course.instructorName || "Instructor"}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-yellow-600 font-bold">4.5</span>
          <span className="text-yellow-500">★★★★★</span>
          <span className="text-gray-500 text-sm">(120)</span>
        </div>

        <p className="text-lg font-bold mt-2">
          ₹{course.price || 499}
        </p>

      </div>
    </div>
  );
}

export default CourseCard;