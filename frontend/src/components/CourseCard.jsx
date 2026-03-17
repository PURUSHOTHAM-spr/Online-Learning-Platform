function CourseCard({ course }) {

  return (

    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">

      <img
        src="https://img.freepik.com/free-photo/programming-background-collage_23-2149901789.jpg"
        className="h-40 w-full object-cover"
      />

      <div className="p-4">

        <h3 className="font-semibold text-lg">
          {course.title}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {course.category}
        </p>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {course.description}
        </p>

        <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded">
          View Course
        </button>

      </div>

    </div>

  );
}

export default CourseCard;