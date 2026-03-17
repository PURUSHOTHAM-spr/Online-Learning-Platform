import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import {
  FiPlay, FiCheckCircle, FiChevronDown, FiChevronUp,
  FiBook, FiArrowLeft, FiMenu, FiX, FiClock,
  FiLock, FiList, FiMessageSquare, FiFileText,
  FiChevronLeft, FiChevronRight, FiCircle
} from "react-icons/fi";

/* ─── Helpers ─────────────────────────────────────────── */
function fmtDuration(seconds) {
  const s = Number(seconds) || 0;
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

const TABS = ["Overview", "Notes", "Reviews"];

/* ─── Main Component ──────────────────────────────────── */
export default function CourseContent() {
  const { courseId } = useParams();
  const navigate     = useNavigate();
  const videoRef     = useRef(null);

  const [course,         setCourse]         = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [isEnrolled,     setIsEnrolled]     = useState(false);
  const [activeLecture,  setActiveLecture]  = useState(null);  // { sectionIdx, lectureIdx }
  const [completed,      setCompleted]      = useState(() => {
    try { return JSON.parse(localStorage.getItem(`progress_${courseId}`)) || {}; } catch { return {}; }
  });
  const [sidebarOpen,    setSidebarOpen]    = useState(true);
  const [openSections,   setOpenSections]   = useState({});
  const [tab,            setTab]            = useState("Overview");
  const [note,           setNote]           = useState("");
  const [notes,          setNotes]          = useState(() => {
    try { return JSON.parse(localStorage.getItem(`notes_${courseId}`)) || []; } catch { return []; }
  });

  /* Fetch course + enrollment check */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [courseRes, enrolledRes] = await Promise.all([
          axiosInstance.get(`/user-api/course/${courseId}`),
          axiosInstance.get("/user-api/my-courses"),
        ]);
        const data         = courseRes.data.payload;
        const enrolledList = enrolledRes.data.payload || [];
        const enrolled     = enrolledList.some(c => c._id === courseId);

        setCourse(data);
        setIsEnrolled(enrolled);

        if (!enrolled) {
          toast.error("You must be enrolled to access course content.");
          navigate(`/course/${courseId}`);
          return;
        }

        // Default: open first section, select first lecture
        if (data.sections?.length > 0) {
          setOpenSections({ [data.sections[0]._id]: true });
          if (data.sections[0].lectures?.length > 0) {
            setActiveLecture({ sectionIdx: 0, lectureIdx: 0 });
          }
        }
      } catch (err) {
        toast.error("Failed to load course content.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [courseId]);

  /* Persist progress & notes to localStorage */
  useEffect(() => {
    localStorage.setItem(`progress_${courseId}`, JSON.stringify(completed));
  }, [completed, courseId]);

  useEffect(() => {
    localStorage.setItem(`notes_${courseId}`, JSON.stringify(notes));
  }, [notes, courseId]);

  /* Computed: current lecture object */
  const currentLecture = activeLecture && course
    ? course.sections[activeLecture.sectionIdx]?.lectures[activeLecture.lectureIdx]
    : null;

  /* Flat list of all lectures for next/prev navigation */
  const allLectures = course
    ? course.sections.flatMap((s, si) =>
        s.lectures.map((l, li) => ({ lecture: l, sectionIdx: si, lectureIdx: li }))
      )
    : [];

  const flatIdx = activeLecture
    ? allLectures.findIndex(
        a => a.sectionIdx === activeLecture.sectionIdx && a.lectureIdx === activeLecture.lectureIdx
      )
    : 0;

  /* Completion toggle */
  const toggleComplete = useCallback((lectureId) => {
    setCompleted(prev => {
      const next = { ...prev };
      if (next[lectureId]) delete next[lectureId];
      else next[lectureId] = true;
      return next;
    });
  }, []);

  /* Mark current as complete when video ends */
  const handleVideoEnded = () => {
    if (currentLecture) {
      setCompleted(prev => ({ ...prev, [currentLecture._id]: true }));
      toast.success("Lecture completed! ✅");
    }
  };

  /* Navigate to next / previous lecture */
  const goTo = (newFlatIdx) => {
    if (newFlatIdx < 0 || newFlatIdx >= allLectures.length) return;
    const { sectionIdx, lectureIdx } = allLectures[newFlatIdx];
    setActiveLecture({ sectionIdx, lectureIdx });
    setOpenSections(prev => ({
      ...prev,
      [course.sections[sectionIdx]._id]: true
    }));
    if (videoRef.current) videoRef.current.scrollIntoView({ behavior: "smooth" });
  };

  /* Save note */
  const saveNote = () => {
    if (!note.trim()) return;
    const entry = {
      id:           Date.now(),
      text:         note.trim(),
      lectureTitle: currentLecture?.title || "",
      createdAt:    new Date().toISOString()
    };
    setNotes(prev => [entry, ...prev]);
    setNote("");
    toast.success("Note saved!");
  };

  /* Progress % */
  const totalLectures    = allLectures.length;
  const completedCount   = allLectures.filter(a => completed[a.lecture._id]).length;
  const progressPct      = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

  /* ─── Loading / Not found ─── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-medium">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-900 text-white">
        <FiBook size={48} className="text-slate-500" />
        <p className="text-slate-400">Course not found.</p>
        <button onClick={() => navigate(-1)} className="px-5 py-2 bg-violet-600 rounded-xl text-sm font-bold hover:bg-violet-700 transition">Go Back</button>
      </div>
    );
  }

  /* ─── Render ─── */
  return (
    <div className="flex flex-col bg-slate-950 min-h-screen text-white" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── TOP NAV BAR ── */}
      <header className="flex items-center justify-between px-4 lg:px-6 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="text-slate-400 hover:text-white transition shrink-0"
            title="Back to course"
          >
            <FiArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              {course.category} · {course.courseLevel}
            </p>
            <h1 className="text-sm font-bold text-white truncate max-w-xs lg:max-w-md">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
              {completedCount}/{totalLectures} · {progressPct}%
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-slate-300"
            title={sidebarOpen ? "Hide curriculum" : "Show curriculum"}
          >
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 overflow-hidden min-h-0 relative">

        {/* ── VIDEO SIDE ── */}
        <div className={`flex flex-col flex-1 min-w-0 overflow-y-auto transition-all duration-300`}>

          {/* Video player */}
          <div className="bg-black w-full" style={{ minHeight: "240px" }}>
            {currentLecture?.videoUrl ? (
              <video
                ref={videoRef}
                key={currentLecture._id}
                src={currentLecture.videoUrl}
                controls
                onEnded={handleVideoEnded}
                className="w-full max-h-[70vh] object-contain bg-black"
                controlsList="nodownload"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500 gap-3">
                <FiLock size={24} />
                <span>No video available for this lecture.</span>
              </div>
            )}
          </div>

          {/* Lecture nav bar */}
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 bg-slate-900 border-b border-slate-800">
            <button
              onClick={() => goTo(flatIdx - 1)}
              disabled={flatIdx === 0}
              className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white disabled:opacity-30 transition"
            >
              <FiChevronLeft size={16} /> Previous
            </button>

            <div className="text-center">
              <p className="text-xs text-slate-500">
                Lecture {flatIdx + 1} of {totalLectures}
              </p>
              <p className="text-sm font-bold text-white truncate max-w-xs">
                {currentLecture?.title}
              </p>
            </div>

            <button
              onClick={() => goTo(flatIdx + 1)}
              disabled={flatIdx >= totalLectures - 1}
              className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white disabled:opacity-30 transition"
            >
              Next <FiChevronRight size={16} />
            </button>
          </div>

          {/* Info tabs */}
          <div className="px-4 lg:px-8 py-6 max-w-3xl">
            {/* Lecture header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{currentLecture?.title}</h2>
                {currentLecture?.description && (
                  <p className="text-slate-400 text-sm">{currentLecture.description}</p>
                )}
              </div>
              <button
                onClick={() => currentLecture && toggleComplete(currentLecture._id)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
                  completed[currentLecture?._id]
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "border border-slate-600 text-slate-400 hover:border-emerald-500 hover:text-emerald-400"
                }`}
              >
                <FiCheckCircle size={15} />
                {completed[currentLecture?._id] ? "Completed" : "Mark Complete"}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800 mb-6 gap-1">
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition ${
                    tab === t
                      ? "text-violet-400 border-b-2 border-violet-400"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {t === "Overview" && <FiList size={14} />}
                  {t === "Notes"    && <FiFileText size={14} />}
                  {t === "Reviews" && <FiMessageSquare size={14} />}
                  {t}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {tab === "Overview" && (
              <div className="space-y-5">
                {currentLecture?.duration && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <FiClock size={14} /> Duration: {fmtDuration(currentLecture.duration)}
                  </div>
                )}
                {course.courseOutcomes?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-300 mb-3">What you'll learn in this course</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {course.courseOutcomes.map((o, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                          <FiCheckCircle size={13} className="text-violet-400 mt-0.5 shrink-0" />
                          <span>{o}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Notes */}
            {tab === "Notes" && (
              <div className="space-y-4">
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
                  <p className="text-xs text-slate-500 mb-2 font-semibold">
                    Lecture: <span className="text-slate-400">{currentLecture?.title}</span>
                  </p>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Take a note for this lecture..."
                    rows={4}
                    className="w-full bg-transparent outline-none text-sm text-slate-200 placeholder-slate-600 resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={saveNote}
                      disabled={!note.trim()}
                      className="px-4 py-2 bg-violet-600 text-white text-sm font-bold rounded-lg hover:bg-violet-700 transition disabled:opacity-40"
                    >
                      Save Note
                    </button>
                  </div>
                </div>

                {notes.length === 0 ? (
                  <p className="text-slate-600 text-sm text-center py-4">No notes yet. Start taking notes!</p>
                ) : (
                  <div className="space-y-3">
                    {notes.map(n => (
                      <div key={n.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-semibold text-violet-400 truncate">{n.lectureTitle}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-600">
                              {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                            <button
                              onClick={() => setNotes(prev => prev.filter(x => x.id !== n.id))}
                              className="text-slate-600 hover:text-red-400 transition"
                            >
                              <FiX size={13} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{n.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Reviews */}
            {tab === "Reviews" && (
              <div className="space-y-4">
                {course.reviews?.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-6">No reviews yet.</p>
                ) : (
                  course.reviews.map((rev, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-3">
                      <div className="w-9 h-9 rounded-xl bg-violet-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {rev.user?.firstName?.[0] || "S"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-slate-200">
                            {rev.user?.firstName || "Student"} {rev.user?.lastName || ""}
                          </p>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <span key={s} className={s <= rev.rating ? "text-amber-400" : "text-slate-700"}>★</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-400">{rev.review}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── CURRICULUM SIDEBAR ── */}
        {sidebarOpen && (
          <aside className="w-full lg:w-80 xl:w-96 shrink-0 bg-slate-900 border-l border-slate-800 overflow-y-auto flex flex-col absolute lg:relative right-0 top-0 h-full z-20 lg:z-auto shadow-2xl">
            
            {/* Sidebar header */}
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
              <h2 className="font-bold text-white text-sm flex items-center gap-2 mb-3">
                <FiBook size={15} className="text-violet-400" /> Course Content
              </h2>

              {/* Overall progress */}
              <div className="bg-slate-800 rounded-xl px-4 py-3">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>{completedCount} of {totalLectures} completed</span>
                  <span className="font-bold text-violet-400">{progressPct}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sections + lectures */}
            <div className="flex-1 overflow-y-auto">
              {course.sections.map((section, si) => {
                const sectionComplete = section.lectures.filter(l => completed[l._id]).length;
                const isOpen          = openSections[section._id];

                return (
                  <div key={section._id} className="border-b border-slate-800">
                    {/* Section heading */}
                    <button
                      onClick={() => setOpenSections(prev => ({ ...prev, [section._id]: !prev[section._id] }))}
                      className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-800/50 transition text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-violet-400 font-semibold mb-0.5">Section {si + 1}</p>
                        <p className="text-sm font-bold text-white truncate">{section.sectionTitle}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {sectionComplete}/{section.lectures.length} · {section.lectures.length} lectures
                        </p>
                      </div>
                      {isOpen
                        ? <FiChevronUp size={15} className="text-slate-500 shrink-0" />
                        : <FiChevronDown size={15} className="text-slate-500 shrink-0" />
                      }
                    </button>

                    {/* Lectures */}
                    {isOpen && (
                      <div>
                        {section.lectures.map((lecture, li) => {
                          const isActive = activeLecture?.sectionIdx === si && activeLecture?.lectureIdx === li;
                          const isDone   = completed[lecture._id];
                          return (
                            <button
                              key={lecture._id}
                              onClick={() => {
                                setActiveLecture({ sectionIdx: si, lectureIdx: li });
                                if (videoRef.current) videoRef.current.scrollIntoView({ behavior: "smooth" });
                              }}
                              className={`w-full flex items-start gap-3 px-5 py-3 text-left transition ${
                                isActive
                                  ? "bg-violet-600/20 border-l-2 border-violet-500"
                                  : "hover:bg-slate-800/40 border-l-2 border-transparent"
                              }`}
                            >
                              {/* Status icon */}
                              <div className="mt-0.5 shrink-0">
                                {isDone ? (
                                  <FiCheckCircle size={16} className="text-emerald-400" />
                                ) : isActive ? (
                                  <FiPlay size={16} className="text-violet-400" />
                                ) : (
                                  <FiCircle size={16} className="text-slate-600" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium leading-snug truncate ${
                                  isActive ? "text-violet-300" : isDone ? "text-slate-400" : "text-slate-300"
                                }`}>
                                  {lecture.title}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {lecture.isPreview && (
                                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-900/40 px-1.5 py-0.5 rounded">Preview</span>
                                  )}
                                  {lecture.duration && (
                                    <span className="text-[11px] text-slate-600">{fmtDuration(lecture.duration)}</span>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sidebar footer */}
            <div className="px-5 py-4 border-t border-slate-800 bg-slate-900">
              <Link
                to={`/course/${courseId}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:bg-slate-800 transition"
              >
                <FiFileText size={14} /> Course Overview
              </Link>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
