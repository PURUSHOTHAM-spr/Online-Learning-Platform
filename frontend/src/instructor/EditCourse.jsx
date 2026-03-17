import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { FiArrowLeft, FiSave, FiPlus, FiTrash2, FiVideo, FiLayers, FiInfo, FiChevronDown, FiChevronUp } from "react-icons/fi";

const categories = ["Development", "Design", "Business", "Marketing", "IT & Software", "Personal Development", "Photography", "Music"];
const levels = ["Beginner", "Intermediate", "Advanced"];

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // New section form
  const [newSectionTitle, setNewSectionTitle] = useState("");
  // New lecture form (keyed by section ID)
  const [newLectureTitle, setNewLectureTitle] = useState({});
  const [newLectureUrl, setNewLectureUrl] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axiosInstance.get(`/instructor-api/course/${courseId}`);
        const loadedCourse = res.data.payload;
        setCourse(loadedCourse);
        
        // Expand all sections by default
        if (loadedCourse?.sections) {
          const exp = {};
          loadedCourse.sections.forEach(s => exp[s._id] = true);
          setExpandedSections(exp);
        }
      } catch (err) {
        toast.error("Failed to load course for editing.");
        navigate("/instructor-my-courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveCourse = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put(`/instructor-api/update-course/${courseId}`, {
        title: course.title,
        description: course.description,
        price: course.price,
        category: course.category,
        courseLevel: course.courseLevel,
      });
      toast.success("Course details saved securely!");
    } catch (err) {
      toast.error("Failed to save course details.");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Curriculum Methods ---

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    try {
      const res = await axiosInstance.post(`/instructor-api/add-section/${courseId}`, { sectionTitle: newSectionTitle });
      setCourse(res.data.payload);
      setNewSectionTitle("");
      toast.success("Section created");
      
      // Auto expand new section
      const addedSection = res.data.payload.sections[res.data.payload.sections.length - 1];
      if(addedSection) {
        setExpandedSections(prev => ({ ...prev, [addedSection._id]: true }));
      }
    } catch (err) {
      toast.error("Failed to add section");
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Are you sure you want to delete this section and all its contents?")) return;
    try {
      const res = await axiosInstance.delete(`/instructor-api/delete-section/${courseId}/${sectionId}`);
      setCourse(res.data.payload);
      toast.success("Section removed");
    } catch (err) {
      toast.error("Failed to delete section");
    }
  };

  const handleAddLecture = async (sectionId) => {
    const title = newLectureTitle[sectionId];
    const url = newLectureUrl[sectionId];
    if (!title || !title.trim() || !url || !url.trim()) {
      toast.error("Lecture title and video URL are required");
      return;
    }
    try {
      const res = await axiosInstance.post(`/instructor-api/add-lecture/${courseId}/${sectionId}`, { title, videoUrl: url });
      setCourse(res.data.payload);
      setNewLectureTitle({ ...newLectureTitle, [sectionId]: "" });
      setNewLectureUrl({ ...newLectureUrl, [sectionId]: "" });
      toast.success("Lecture published");
    } catch (err) {
      toast.error("Failed to add lecture");
    }
  };

  const handleDeleteLecture = async (sectionId, lectureId) => {
    if (!window.confirm("Remove this lecture?")) return;
    try {
      const res = await axiosInstance.delete(`/instructor-api/delete-lecture/${courseId}/${sectionId}/${lectureId}`);
      setCourse(res.data.payload);
      toast.success("Lecture removed");
    } catch (err) {
      toast.error("Failed to delete lecture");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      
      {/* ── TOP NAV BAR ── */}
      <div className="bg-white border-b border-slate-200 px-6 lg:px-12 py-4 flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-30 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <Link 
            to={`/instructor/course/${courseId}`}
            className="flex items-center justify-center w-10 h-10 bg-slate-50 text-slate-500 rounded-full hover:bg-blue-50 hover:text-blue-600 transition border border-slate-200"
            title="Back to Course Details"
          >
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest bg-blue-50 inline-block px-2 py-0.5 rounded shadow-sm mb-1">Editing Course Space</p>
            <h1 className="font-extrabold text-xl leading-tight line-clamp-1">{course.title}</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSaveCourse}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-200 disabled:opacity-70 w-full md:w-auto"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</>
            ) : (
              <><FiSave size={18} /> Publish Changes</>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* ── LEFT SIDEBAR NAV ── */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sticky top-28">
            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              <button 
                onClick={() => setActiveTab("basic")}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === "basic" 
                  ? "bg-blue-50 text-blue-700 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${activeTab === "basic" ? "bg-white shadow-sm" : ""}`}><FiInfo size={16} /></div>
                Basic Information
              </button>
              <button 
                onClick={() => setActiveTab("curriculum")}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === "curriculum" 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${activeTab === "curriculum" ? "bg-white shadow-sm" : ""}`}><FiLayers size={16} /></div>
                Curriculum Editor
              </button>
            </nav>
          </div>
        </div>

        {/* ── MAIN CONTENT AREA ── */}
        <div className="flex-1">
          
          {/* BASIC INFO TAB */}
          <div className={`space-y-6 ${activeTab === "basic" ? "block animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}`}>
            
            <div className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-sm">
              <div className="mb-8 border-b border-slate-100 pb-5">
                <h2 className="text-2xl font-bold text-slate-800">Course identity</h2>
                <p className="text-slate-500 mt-1">Make your course stand out with a clear title and description.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Course Title</label>
                  <input
                    type="text"
                    name="title"
                    value={course.title}
                    onChange={handleChange}
                    placeholder="e.g. Complete Web Development Bootcamp"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-800 font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Course Description</label>
                  <textarea
                    name="description"
                    value={course.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="What will students learn in this course?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-medium leading-relaxed focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-sm">
               <div className="mb-8 border-b border-slate-100 pb-5">
                <h2 className="text-2xl font-bold text-slate-800">Targeting & Pricing</h2>
                <p className="text-slate-500 mt-1">Help the right students discover your course.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      name="price"
                      value={course.price}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-8 pr-4 py-3.5 text-slate-800 font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={course.category}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition appearance-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Difficulty Level</label>
                  <select
                    name="courseLevel"
                    value={course.courseLevel}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition appearance-none"
                  >
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>

          </div>


          {/* CURRICULUM TAB */}
          <div className={`space-y-6 ${activeTab === "curriculum" ? "block animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}`}>
            
            <div className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-sm">
              <div className="mb-8 border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Curriculum Builder</h2>
                  <p className="text-slate-500 mt-1">Structure your course content logically. Organize by sections and lectures.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Existing Sections List */}
                {course.sections?.map((section, sIdx) => {
                  const isExpanded = expandedSections[section._id];
                  
                  return (
                    <div key={section._id} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden transition-all duration-300">
                      
                      {/* Section Header */}
                      <div className="bg-slate-50/50 hover:bg-slate-50 px-6 py-5 flex items-center justify-between cursor-pointer border-b border-transparent data-[state=open]:border-slate-200" data-state={isExpanded ? "open" : "closed"} onClick={() => toggleSection(section._id)}>
                        <div className="flex items-center gap-4">
                          <button className="text-slate-400 hover:text-slate-800 bg-white shadow-sm p-1.5 rounded-md border border-slate-200">
                            {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                          </button>
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Section {sIdx + 1}</span>
                            <h3 className="font-extrabold text-slate-800 text-lg leading-none">{section.sectionTitle}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100 text-slate-500">
                            {section.lectures?.length || 0} Lectures
                          </span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteSection(section._id); }}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition"
                            title="Delete Section"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Section Content (Lectures + Form) */}
                      {isExpanded && (
                        <div className="p-6 bg-white animate-in fade-in slide-in-from-top-2">
                          
                          {/* Lectures List */}
                          <div className="space-y-3 mb-6">
                            {section.lectures?.length === 0 ? (
                              <div className="text-center py-6 bg-slate-50 border border-slate-100 border-dashed rounded-2xl text-slate-400 text-sm font-medium">
                                No lectures added yet.
                              </div>
                            ) : (
                              section.lectures?.map((lec, lIdx) => (
                                <div key={lec._id} className="group border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 bg-white transition-all">
                                  <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                      <FiVideo size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-bold text-slate-700 truncate">{lec.title}</span>
                                      <span className="text-xs text-slate-400 truncate max-w-xs md:max-w-sm">{lec.videoUrl}</span>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => handleDeleteLecture(section._id, lec._id)}
                                    className="text-slate-300 hover:text-white hover:bg-red-500 p-2 rounded-xl transition flex-shrink-0 opacity-0 group-hover:opacity-100"
                                  >
                                    <FiTrash2 size={16} />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Add Lecture Inline Form */}
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 shadow-inner">
                            <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3 flex items-center gap-2">
                              <FiPlus /> Add New Lecture
                            </h4>
                            <div className="flex flex-col md:flex-row gap-3">
                              <input 
                                type="text" 
                                placeholder="Lecture Title"
                                value={newLectureTitle[section._id] || ""}
                                onChange={(e) => setNewLectureTitle({...newLectureTitle, [section._id]: e.target.value})}
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition font-medium text-slate-700"
                              />
                              <input 
                                type="url" 
                                placeholder="Video URL (e.g. YouTube, mp4)"
                                value={newLectureUrl[section._id] || ""}
                                onChange={(e) => setNewLectureUrl({...newLectureUrl, [section._id]: e.target.value})}
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition font-medium text-slate-700"
                              />
                              <button 
                                onClick={() => handleAddLecture(section._id)}
                                className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-900 transition flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-slate-900/20"
                              >
                                Add
                              </button>
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  );
                })}

                {/* Add New Section Floating Action */}
                <form onSubmit={handleAddSection} className="relative mt-12 bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-3xl p-8 text-center transition hover:bg-indigo-50">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full text-xs font-bold text-indigo-400 uppercase tracking-widest border border-indigo-100">
                    New Section
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
                    <input 
                      type="text" 
                      placeholder="e.g. React Native Fundamentals"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition font-bold text-slate-700 text-center sm:text-left shadow-sm"
                    />
                    <button 
                      type="submit"
                      disabled={!newSectionTitle.trim()}
                      className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition shadow-lg shadow-indigo-200 w-full sm:w-auto shrink-0"
                    >
                      Add Section
                    </button>
                  </div>
                </form>

              </div>
            </div>
            
          </div>
          
        </div>

      </div>
    </div>
  );
}
