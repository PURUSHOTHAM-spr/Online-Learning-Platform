import courses from "../data/courses";
import CourseCard from "./CourseCard";

function CoursesSection() {
  return (

    <div className="mt-12">

      <h2 className="text-2xl font-bold mb-6">
        Popular Courses
      </h2>

      <div className="grid grid-cols-4 gap-6">

        {courses.map((course, i) => (
  <div key={i}>{course.title}</div>
))}

      </div>

    </div>

  );
}

export default CoursesSection;