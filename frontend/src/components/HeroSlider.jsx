import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
  title: "Master React Development",
  description:
    "Build modern user interfaces using React, hooks, and advanced state management.",
  image:
    "https://img.freepik.com/free-photo/programmer-working-computer-office_1098-18699.jpg",
},

{
  title: "Learn Backend with Node.js",
  description:
    "Create powerful REST APIs using Node.js, Express, and MongoDB.",
  image:
    "https://img.freepik.com/free-photo/programmer-working-laptop-dark-room_1098-18690.jpg",
},

{
  title: "Complete JavaScript Bootcamp",
  description:
    "Master JavaScript from basics to advanced concepts including ES6, async programming, and DOM manipulation.",
  image:
    "https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg",
},

{
  title: "Become a Data Structures Expert",
  description:
    "Learn algorithms, problem solving, and crack coding interviews with confidence.",
  image:
    "https://img.freepik.com/free-photo/businesswoman-working-laptop_23-2147980803.jpg",
},

{
  title: "Build Real World MERN Projects",
  description:
    "Develop complete applications using MongoDB, Express, React, and Node.",
  image:
    "https://img.freepik.com/free-photo/team-working-animation-project_23-2149269877.jpg",
},

{
  title: "UI/UX Design Fundamentals",
  description:
    "Design beautiful and user-friendly web interfaces with modern tools and techniques.",
  image:
    "https://img.freepik.com/free-photo/ui-ux-representations-with-laptop_23-2150201871.jpg",
},
];

function HeroSlider() {
  return (

    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 4000 }}
      loop={true}
      className="bg-gray-100 rounded-xl"
    >

      {slides.map((slide, i) => (

        <SwiperSlide key={i}>

          <div className="flex items-center justify-between p-12">

            {/* LEFT CONTENT */}

            <div className="bg-white p-8 rounded-lg shadow-md max-w-md">

              <h2 className="text-3xl font-bold mb-3">
                {slide.title}
              </h2>

              <p className="text-gray-600 mb-5">
                {slide.description}
              </p>

              <button className="bg-purple-600 text-white px-5 py-3 rounded-lg">
                Learn more
              </button>

            </div>


            {/* RIGHT IMAGE */}

            <img
              src={slide.image}
              className="h-72 object-contain"
            />

          </div>

        </SwiperSlide>

      ))}

    </Swiper>

  );
}

export default HeroSlider;