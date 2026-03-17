function CourseCard({ course }) {
  const rating = (4.3 + (course.id % 4) * 0.15).toFixed(1);
  const students = `${(course.id * 1123).toLocaleString()} students`;

  return (
    <article className="group overflow-hidden rounded-xl border border-[#e7e9eb] bg-white transition hover:-translate-y-1 hover:shadow-[0_22px_45px_-25px_rgba(16,24,40,0.45)]">
      <img
        src={course.image}
        alt={course.title}
        className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-[#1c1d1f]">
          {course.title}
        </h3>

        <p className="text-sm font-medium text-[#6a6f73]">By CourseHub Academy</p>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-[#8b4309]">{rating}</span>
          <span className="text-[#f69c08]">★★★★★</span>
          <span className="text-[#6a6f73]">({students})</span>
        </div>

        <p className="text-sm font-medium text-[#3e4143]">
          {course.category} • {course.level}
        </p>

        <p className="line-clamp-2 text-sm text-[#4d5156]">{course.description}</p>

        <div className="pt-2">
          <span className="text-lg font-black text-[#1c1d1f]">$49.99</span>
          <span className="ml-2 text-sm text-[#6a6f73] line-through">$109.99</span>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;