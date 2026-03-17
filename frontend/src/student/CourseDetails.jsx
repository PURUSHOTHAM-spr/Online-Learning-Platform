import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import {
  FiBook, FiStar, FiUsers, FiClock, FiPlay,
  FiChevronDown, FiChevronUp, FiCheckCircle,
  FiArrowLeft, FiBarChart2, FiTag, FiLock, FiEdit3
} from "react-icons/fi";

const levelColor = {
  Beginner:     "text-emerald-700 bg-emerald-50 border-emerald-200",
  Intermediate: "text-amber-700   bg-amber-50   border-amber-200",
  Advanced:     "text-red-700     bg-red-50     border-red-200",
};

function CourseDetails() {
  const { courseId }  = useParams();
  const navigate      = useNavigate();

  const [course,       setCourse]       = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [isEnrolled,   setIsEnrolled]   = useState(false);
  const [enrolling,    setEnrolling]    = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [hoverStar,    setHoverStar]    = useState(0);
  const [reviewForm,   setReviewForm]   = useState({ rating: 0, review: "" });
  const [submitting,   setSubmitting]   = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const hasReviewed = course?.reviews?.some(
    r => r.user?._id === user?._id || r.user === user?._id
  );

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [courseRes, enrolledRes] = await Promise.all([
          axiosInstance.get(`/user-api/course/${courseId}`),
          axiosInstance.get("/user-api/my-courses"),
        ]);
        const courseData    = courseRes.data.payload;
        const enrolledList  = enrolledRes.data.payload || [];
        setCourse(courseData);
        setIsEnrolled(enrolledList.some(c => c._id === courseId));

        // Open first section by default
        if (courseData.sections?.length > 0) {
          setOpenSections({ [courseData.sections[0]._id]: true });
        }
      } catch (err) {
        toast.error("Failed to load course details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [courseId]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await axiosInstance.post("/user-api/enroll-course", { courseId });
      setIsEnrolled(true);
      toast.success("You're enrolled! Happy learning 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed.");
    } finally {
      setEnrolling(false);
    }
  };

  const toggleSection = (id) =>
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) { toast.error("Please select a star rating."); return; }
    if (!reviewForm.review.trim()) { toast.error("Please write a review."); return; }
    setSubmitting(true);
    try {
      const res = await axiosInstance.post(`/user-api/review/${courseId}`, reviewForm);
      setCourse(res.data.payload);
      setReviewForm({ rating: 0, review: "" });
      toast.success("Review submitted! Thank you 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalLectures = course?.sections?.reduce(
    (acc, s) => acc + (s.lectures?.length || 0), 0
  ) || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f8fafc]">
        <FiBook size={48} className="text-slate-300" />
        <p className="text-slate-500 text-lg font-semibold">Course not found.</p>
        <button onClick={() => navigate(-1)} className="px-5 py-2 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ── HERO ── */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 flex flex-col lg:flex-row gap-10">

          {/* Left: info */}
          <div className="flex-1">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition"
            >
              <FiArrowLeft size={16} /> Back
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {course.courseLevel && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full border bg-white/10 text-white border-white/20`}>
                  {course.courseLevel}
                </span>
              )}
              {course.category && (
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <FiTag size={11} /> {course.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold mb-4 leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-base mb-6 max-w-xl leading-relaxed">
              {course.description}
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <FiStar className="text-amber-400" />
                {course.rating > 0 ? `${course.rating.toFixed(1)} Rating` : "No ratings yet"}
              </span>
              <span className="flex items-center gap-2">
                <FiUsers /> {course.studentsEnrolled || 0} Students
              </span>
              <span className="flex items-center gap-2">
                <FiBook /> {course.sections?.length || 0} Sections
              </span>
              <span className="flex items-center gap-2">
                <FiPlay /> {totalLectures} Lectures
              </span>
            </div>
          </div>

          {/* Right: Course card */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              {/* Thumbnail */}
              <div className="relative h-44 bg-gradient-to-br from-violet-600 to-indigo-500">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiBook size={40} className="text-white/40" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  {course.courseLevel && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${levelColor[course.courseLevel]}`}>
                      {course.courseLevel}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">{course.sections?.length || 0} sections · {totalLectures} lectures</span>
                </div>

                {isEnrolled ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                      <FiCheckCircle size={16} /> You're enrolled in this course
                    </div>
                    <Link
                      to="/my-courses"
                      className="block text-center w-full py-3 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-700 transition"
                    >
                      Go to My Courses
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-3.5 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-700 transition shadow-lg shadow-violet-200 disabled:opacity-60"
                  >
                    {enrolling ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enrolling...
                      </span>
                    ) : "Enroll for Free"}
                  </button>
                )}

                {/* Quick info list */}
                <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
                  {[
                    { icon: <FiBarChart2 size={14} />, text: course.courseLevel || "All levels" },
                    { icon: <FiBook size={14} />, text: `${course.sections?.length || 0} sections` },
                    { icon: <FiPlay size={14} />, text: `${totalLectures} lectures` },
                    { icon: <FiClock size={14} />, text: "Lifetime access" },
                    { icon: <FiCheckCircle size={14} />, text: "Certificate of completion" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-500">
                      <span className="text-violet-500">{item.icon}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 flex flex-col lg:flex-row gap-10">

        {/* Left col */}
        <div className="flex-1 min-w-0 space-y-10">

          {/* What you'll learn */}
          {course.courseOutcomes?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <h2 className="text-xl font-bold text-slate-800 mb-5">What you'll learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.courseOutcomes.map((outcome, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <FiCheckCircle size={15} className="text-violet-500 mt-0.5 shrink-0" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course Curriculum */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Course Curriculum</h2>
            <p className="text-slate-400 text-sm mb-6">
              {course.sections?.length || 0} sections · {totalLectures} lectures
            </p>

            {course.sections?.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No content yet. Check back soon!</p>
            ) : (
              <div className="space-y-3">
                {course.sections?.map((section, si) => (
                  <div key={section._id} className="border border-slate-200 rounded-xl overflow-hidden">
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section._id)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">
                          Section {si + 1}
                        </span>
                        <span className="font-bold text-slate-700 text-sm">{section.sectionTitle}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-slate-400">{section.lectures?.length || 0} lectures</span>
                        {openSections[section._id]
                          ? <FiChevronUp size={16} className="text-slate-400" />
                          : <FiChevronDown size={16} className="text-slate-400" />
                        }
                      </div>
                    </button>

                    {/* Lectures */}
                    {openSections[section._id] && (
                      <div className="divide-y divide-slate-100">
                        {section.lectures?.length === 0 ? (
                          <p className="px-5 py-3 text-sm text-slate-400">No lectures in this section.</p>
                        ) : section.lectures?.map((lecture, li) => (
                          <div key={lecture._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-violet-50/30 transition">
                            <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                              {isEnrolled
                                ? <FiPlay size={12} className="text-violet-600" />
                                : <FiLock size={11} className="text-violet-400" />
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-700 truncate">{lecture.title}</p>
                              {lecture.description && (
                                <p className="text-xs text-slate-400 truncate mt-0.5">{lecture.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              {lecture.isPreview && (
                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                  Preview
                                </span>
                              )}
                              {lecture.duration && (
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                  <FiClock size={11} /> {Math.floor(Number(lecture.duration) / 60)}m {Math.round(Number(lecture.duration) % 60)}s
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── REVIEWS SECTION ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FiStar className="text-amber-400" size={20} />
                  Student Reviews
                  <span className="text-base font-normal text-slate-400 ml-1">({course.reviews?.length || 0})</span>
                </h2>
                {course.rating > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-3xl font-black text-slate-800">{course.rating.toFixed(1)}</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <FiStar key={s} size={16}
                          className={s <= Math.round(course.rating) ? "text-amber-400 fill-amber-400" : "text-slate-300"}
                          style={s <= Math.round(course.rating) ? {fill: "currentColor"} : {}}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-400">out of 5</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rating distribution bars */}
            {course.reviews?.length > 0 && (
              <div className="mb-8 space-y-1.5">
                {[5,4,3,2,1].map(star => {
                  const count = course.reviews.filter(r => r.rating === star).length;
                  const pct   = course.reviews.length > 0 ? (count / course.reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500 w-3 text-right">{star}</span>
                      <FiStar size={11} className="text-amber-400" style={{fill:"currentColor"}} />
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{width:`${pct}%`}} />
                      </div>
                      <span className="text-slate-400 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Write a Review form — only for enrolled students who haven't reviewed */}
            {isEnrolled && !hasReviewed && (
              <form onSubmit={handleSubmitReview} className="mb-8 bg-violet-50 border border-violet-100 rounded-2xl p-5">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <FiEdit3 size={16} className="text-violet-500" /> Write a Review
                </h3>

                {/* Star picker */}
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(f => ({...f, rating: star}))}
                      onMouseEnter={() => setHoverStar(star)}
                      onMouseLeave={() => setHoverStar(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <FiStar
                        size={28}
                        className={`transition-colors ${
                          star <= (hoverStar || reviewForm.rating)
                            ? "text-amber-400"
                            : "text-slate-300"
                        }`}
                        style={star <= (hoverStar || reviewForm.rating) ? {fill:"currentColor"} : {}}
                      />
                    </button>
                  ))}
                  {reviewForm.rating > 0 && (
                    <span className="ml-2 text-sm font-semibold text-slate-600">
                      {["Terrible","Poor","Average","Good","Excellent"][reviewForm.rating - 1]}
                    </span>
                  )}
                </div>

                {/* Review text */}
                <textarea
                  value={reviewForm.review}
                  onChange={e => setReviewForm(f => ({...f, review: e.target.value}))}
                  placeholder="Share your experience with this course..."
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white resize-none transition"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-3 px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition disabled:opacity-60 flex items-center gap-2"
                >
                  {submitting ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</> : "Submit Review"}
                </button>
              </form>
            )}

            {isEnrolled && hasReviewed && (
              <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-center gap-3 text-sm text-emerald-700 font-semibold">
                <FiCheckCircle size={16} /> You've already reviewed this course. Thank you!
              </div>
            )}

            {!isEnrolled && (
              <div className="mb-8 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-500">
                Enroll in this course to leave a review.
              </div>
            )}

            {/* Reviews list */}
            {course.reviews?.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {course.reviews.map((rev, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {rev.user?.firstName?.[0] || "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                        <p className="text-sm font-bold text-slate-700">
                          {rev.user?.firstName || "Student"} {rev.user?.lastName || ""}
                        </p>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <FiStar key={s} size={13}
                              className={s <= rev.rating ? "text-amber-400" : "text-slate-300"}
                              style={s <= rev.rating ? {fill:"currentColor"} : {}}
                            />
                          ))}
                        </div>
                      </div>
                      {rev.createdAt && (
                        <p className="text-xs text-slate-400 mb-2">
                          {new Date(rev.createdAt).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" })}
                        </p>
                      )}
                      <p className="text-sm text-slate-600 leading-relaxed">{rev.review}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar (desktop) — quick stats summary */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24 space-y-4">
            <h3 className="font-bold text-slate-700 text-sm border-b border-slate-100 pb-3">Course Summary</h3>
            {[
              { label: "Level",    value: course.courseLevel || "All levels" },
              { label: "Category", value: course.category || "—" },
              { label: "Sections", value: course.sections?.length || 0 },
              { label: "Lectures", value: totalLectures },
              { label: "Students", value: course.studentsEnrolled || 0 },
              { label: "Rating",   value: course.rating > 0 ? `${course.rating.toFixed(1)} ★` : "No ratings" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-slate-400">{item.label}</span>
                <span className="font-semibold text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}

export default CourseDetails;