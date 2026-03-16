// src/styles/udemyStyles.js
// Theme: Udemy Inspired — white background, purple accent (#a435f0)
// Clean layout, course cards, instructor sections, learning pages

// ─── Layout ───────────────────────────────────────────
export const pageBackground = "bg-white min-h-screen"
export const pageContainer  = "max-w-7xl mx-auto px-6 py-10"
export const section        = "mb-12"

// ─── Navbar ───────────────────────────────────────────
export const navbarClass =
  "bg-white border-b border-gray-200 px-6 h-[64px] flex items-center sticky top-0 z-50"

export const navContainer =
  "max-w-7xl mx-auto w-full flex items-center justify-between"

export const navLogo =
  "text-xl font-bold text-[#a435f0]"

export const navLinks =
  "flex items-center gap-6"

export const navLink =
  "text-sm text-gray-700 hover:text-black transition"

export const navSearch =
  "flex items-center bg-gray-100 px-4 py-2 rounded-full w-[350px] text-sm focus-within:ring-2 focus-within:ring-[#a435f0]"

// ─── Buttons ──────────────────────────────────────────
export const primaryBtn =
  "bg-[#a435f0] text-white px-5 py-2 text-sm font-semibold rounded hover:bg-[#8710d8] transition"

export const secondaryBtn =
  "border border-black px-5 py-2 text-sm font-semibold hover:bg-gray-100 transition"

export const iconBtn =
  "text-gray-600 hover:text-black transition cursor-pointer"

// ─── Hero Section ─────────────────────────────────────
export const heroWrapper =
  "bg-[#f7f9fa] py-16"

export const heroContainer =
  "max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"

export const heroTitle =
  "text-4xl font-bold text-gray-900 leading-tight"

export const heroText =
  "text-gray-600 text-lg mt-3"

export const heroSearch =
  "bg-white border border-gray-300 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#a435f0]"

// ─── Course Grid ──────────────────────────────────────
export const courseGrid =
  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"

// ─── Course Card ──────────────────────────────────────
export const courseCard =
  "bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"

export const courseImage =
  "w-full h-[150px] object-cover"

export const courseContent =
  "p-4 flex flex-col gap-2"

export const courseTitle =
  "text-sm font-semibold text-gray-900 leading-snug line-clamp-2"

export const courseInstructor =
  "text-xs text-gray-500"

export const courseRatingRow =
  "flex items-center gap-1 text-sm"

export const ratingText =
  "text-[#b4690e] font-semibold"

export const ratingCount =
  "text-gray-500 text-xs"

export const priceRow =
  "flex items-center gap-2 mt-1"

export const currentPrice =
  "text-lg font-bold text-black"

export const oldPrice =
  "text-sm text-gray-400 line-through"

// ─── Category Cards ───────────────────────────────────
export const categoryGrid =
  "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"

export const categoryCard =
  "border border-gray-200 p-4 rounded hover:shadow-sm cursor-pointer text-sm font-semibold text-gray-700 text-center"

// ─── Instructor Section ───────────────────────────────
export const instructorCard =
  "bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center"

export const instructorImage =
  "w-24 h-24 rounded-full object-cover mb-3"

export const instructorName =
  "font-semibold text-gray-900"

export const instructorRole =
  "text-sm text-gray-500"

// ─── Course Page ──────────────────────────────────────
export const coursePageWrapper =
  "max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10"

export const courseMain =
  "lg:col-span-2"

export const courseSidebar =
  "border border-gray-200 rounded-lg p-6 h-fit sticky top-20"

export const coursePageTitle =
  "text-3xl font-bold text-gray-900"

export const courseDescription =
  "text-gray-600 leading-relaxed mt-3"

// ─── Curriculum Section ───────────────────────────────
export const curriculumSection =
  "border border-gray-200 rounded-lg overflow-hidden"

export const curriculumHeader =
  "bg-gray-100 px-4 py-3 font-semibold"

export const lectureRow =
  "flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm"

// ─── Forms ────────────────────────────────────────────
export const formWrapper =
  "max-w-md mx-auto bg-white border border-gray-200 p-8 rounded-lg"

export const formTitle =
  "text-2xl font-bold text-center mb-6"

export const labelClass =
  "text-sm font-medium text-gray-700 block mb-1"

export const inputClass =
  "w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#a435f0] text-sm"

export const formGroup =
  "mb-4"

export const submitBtn =
  "w-full bg-[#a435f0] text-white py-2 rounded font-semibold hover:bg-[#8710d8] transition"

// ─── Feedback ─────────────────────────────────────────
export const errorClass =
  "bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded text-sm"

export const successClass =
  "bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded text-sm"

export const loadingClass =
  "text-center text-sm text-gray-500 animate-pulse py-6"

// ─── Footer ───────────────────────────────────────────
export const footerWrapper =
  "bg-[#1c1d1f] text-gray-300 py-10 mt-16"

export const footerContainer =
  "max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6"

export const footerLink =
  "text-sm hover:underline cursor-pointer"

export const footerCopyright =
  "text-xs text-gray-500 mt-6 text-center"