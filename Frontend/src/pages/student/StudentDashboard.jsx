import {
  pageBackground,
  pageContainer
} from "../../styles/common";

function StudentDashboard() {

  const userName = "Purushotham";

  const courses = [
    {
      id: 1,
      title: "React JS Complete Guide",
      instructor: "Maximilian Schwarzmüller",
      progress: 60,
      image:
        "https://img-c.udemycdn.com/course/480x270/1565838_e54e_18.jpg"
    }
  ];

  return (
    <div className={pageBackground}>

      {/* Welcome Section */}
      <div className="bg-white border-b">
        <div className={pageContainer}>
          <h1 className="text-2xl font-semibold">
            Welcome back, {userName}
          </h1>

          <p className="text-sm text-purple-600 cursor-pointer mt-1">
            Add occupation and interests
          </p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-[#93c5bd] py-14">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 items-center gap-10">

          <div className="bg-white p-8 rounded shadow-sm w-[320px]">
            <h2 className="text-xl font-bold mb-2">
              Expect nothing less than success
            </h2>

            <p className="text-gray-600 text-sm">
              Get the skills that keep business booming.
              <span className="text-purple-600 cursor-pointer">
                {" "}Explore courses now.
              </span>
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="learning illustration"
              className="w-[200px]"
            />
          </div>

        </div>
      </div>

      {/* Continue Learning */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        <h2 className="text-xl font-bold mb-6">
          Continue Learning
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {courses.map((course) => (
            <div
              key={course.id}
              className="border rounded overflow-hidden hover:shadow transition"
            >

              <img
                src={course.image}
                alt={course.title}
                className="h-[150px] w-full object-cover"
              />

              <div className="p-4">

                <h3 className="font-semibold text-sm">
                  {course.title}
                </h3>

                <p className="text-xs text-gray-500">
                  {course.instructor}
                </p>

                {/* Progress Bar */}
                <div className="mt-3 bg-gray-200 h-2 rounded">
                  <div
                    className="bg-purple-600 h-2 rounded"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>

                <p className="text-xs mt-1 text-gray-500">
                  {course.progress}% complete
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;