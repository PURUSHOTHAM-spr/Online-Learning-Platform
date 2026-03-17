import courses from "../data/courses";
import CourseCard from "./CourseCard";

const categories = [
  "All",
  "Frontend Development",
  "Full Stack",
  "Programming",
  "Computer Science",
];

function CoursesSection() {
  return (
    <section className="mt-16">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#1c1d1f]">
            Learners are viewing
          </h2>
          <p className="mt-2 text-[#4d5156]">
            Most popular picks based on enrollments and outcomes this week.
          </p>
        </div>

        <button className="w-fit rounded border border-[#1c1d1f] px-4 py-2 text-sm font-bold text-[#1c1d1f] transition hover:bg-[#f7f9fa]">
          Show all courses
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              category === "All"
                ? "bg-[#1c1d1f] text-white"
                : "bg-[#f2f3f5] text-[#2d2f31] hover:bg-[#e7e9eb]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}

export default CoursesSection;