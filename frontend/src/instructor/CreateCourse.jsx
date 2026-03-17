import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud, FiBook, FiAlignLeft, FiTag, FiBarChart2, FiImage } from "react-icons/fi";

function CreateCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    courseLevel: "Beginner",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const createCourse = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Use FormData to send both fields and the image file
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("courseLevel", form.courseLevel);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const res = await axiosInstance.post(
        "/instructor-api/create-course",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res.data.message || "Course created successfully!");
      setTimeout(() => navigate("/instructor-dashboard"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-violet-700 to-indigo-600 px-8 py-10 text-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-violet-200 text-sm font-medium mb-1">Instructor Panel</p>
          <h1 className="text-3xl font-bold">Create a New Course</h1>
          <p className="text-violet-200 text-sm mt-1">Share your knowledge with the world.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <form onSubmit={createCourse} className="space-y-6">

          {/* THUMBNAIL UPLOAD */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
              <FiImage className="text-violet-500" /> Course Thumbnail
            </label>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("thumbnailInput").click()}
              className="relative cursor-pointer border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden hover:border-violet-400 transition-colors group"
              style={{ minHeight: "220px" }}
            >
              {preview ? (
                <div className="relative w-full h-56">
                  <img
                    src={preview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <p className="text-white font-semibold text-sm">Click to change</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-56 gap-3 text-slate-400 group-hover:text-violet-500 transition-colors">
                  <FiUploadCloud size={36} />
                  <p className="text-sm font-semibold">Drag & drop or click to upload</p>
                  <p className="text-xs">JPG, PNG, WEBP (recommended 1280×720)</p>
                </div>
              )}
              <input
                id="thumbnailInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* COURSE DETAILS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
            <h2 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-3">Course Details</h2>

            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                <FiBook size={13} className="text-violet-500" /> Title *
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Complete Python Bootcamp"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                <FiAlignLeft size={13} className="text-violet-500" /> Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What will students learn? Keep it concise and compelling."
                rows={4}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Category + Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <FiTag size={13} className="text-violet-500" /> Category *
                </label>
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Web Development"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <FiBarChart2 size={13} className="text-violet-500" /> Level
                </label>
                <select
                  value={form.courseLevel}
                  onChange={(e) => setForm({ ...form, courseLevel: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition bg-white"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition shadow-lg shadow-violet-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Course...
              </>
            ) : (
              <>
                <FiBook size={16} /> Create Course
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;