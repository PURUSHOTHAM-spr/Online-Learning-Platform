import React from 'react'
import HeroSlider from "../components/HeroSlider";

function StudentDashboard() {
  return (
    <div>
      <h1 className='text-2xl font-bold text-center mb-6'>StudentDashboard</h1>
      <div className="p-6">

      <HeroSlider />

      <h1 className="text-2xl font-bold mt-10">
        My Courses
      </h1>

    </div>
    </div>
  )
}

export default StudentDashboard