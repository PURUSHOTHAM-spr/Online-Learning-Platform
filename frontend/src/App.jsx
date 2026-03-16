import "./App.css"

function App() {

  const courses = [
    {
      id:1,
      title:"React JS Complete Guide",
      instructor:"Maximilian Schwarzmüller",
      progress:60,
      image:"https://img-c.udemycdn.com/course/480x270/1565838_e54e_18.jpg"
    },
    {
      id:2,
      title:"JavaScript Masterclass",
      instructor:"Jonas Schmedtmann",
      progress:40,
      image:"https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg"
    },
    {
      id:3,
      title:"Python Bootcamp",
      instructor:"Jose Portilla",
      progress:75,
      image:"https://img-c.udemycdn.com/course/480x270/567828_67d0.jpg"
    }
  ]

  return (
    <div className="bg-[#f7f9fa] min-h-screen">

      {/* NAVBAR */}

      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">

        <h1 className="text-xl font-bold text-purple-600">
          Udemy
        </h1>

        <div className="flex gap-6 text-sm">
          <p className="cursor-pointer">Explore</p>
          <p className="cursor-pointer">My Learning</p>
          <p className="cursor-pointer">Wishlist</p>
        </div>

      </nav>


      {/* WELCOME SECTION */}

      <div className="bg-white border-b py-6">

        <div className="max-w-6xl mx-auto px-6">

          <h1 className="text-2xl font-semibold">
            Welcome back, Purushotham
          </h1>

          <p className="text-purple-600 text-sm cursor-pointer mt-1">
            Add occupation and interests
          </p>

        </div>

      </div>


      {/* HERO BANNER */}

      <div className="bg-[#93c5bd] py-16">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

          <div className="bg-white p-8 rounded w-[320px]">

            <h2 className="text-xl font-bold mb-2">
              Expect nothing less than success
            </h2>

            <p className="text-gray-600 text-sm">
              Get the skills that keep business booming.
              <span className="text-purple-600 cursor-pointer">
                {" "}Explore courses now
              </span>
            </p>

          </div>

          <div className="flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              className="w-[200px]"
            />
          </div>

        </div>

      </div>


      {/* CONTINUE LEARNING */}

      <div className="max-w-6xl mx-auto px-6 py-12">

        <h2 className="text-xl font-bold mb-6">
          Continue Learning
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {courses.map((course)=>(
            
            <div
              key={course.id}
              className="bg-white border rounded hover:shadow transition"
            >

              <img
                src={course.image}
                className="h-[150px] w-full object-cover"
              />

              <div className="p-4">

                <h3 className="text-sm font-semibold">
                  {course.title}
                </h3>

                <p className="text-xs text-gray-500">
                  {course.instructor}
                </p>

                {/* progress bar */}

                <div className="mt-3 bg-gray-200 h-2 rounded">
                  <div
                    className="bg-purple-600 h-2 rounded"
                    style={{width:`${course.progress}%`}}
                  />
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
  )
}

export default App