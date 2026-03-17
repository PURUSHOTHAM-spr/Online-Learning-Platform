import React, { useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud, FiImage, FiChevronLeft } from "react-icons/fi";

function CreateCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    courseLevel: "Beginner",
    price: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await axiosInstance.post("/instructor-api/create-course", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course Created Successfully!");
      navigate("/instructor"); // Go back to dashboard
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition"
        >
          <FiChevronLeft /> Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold">Create New Course</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Thumbnail Upload */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-4">Course Thumbnail</label>
            <div 
              onClick={() => document.getElementById('fileInput').click()}
              className="relative group aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="text-center p-4">
                  <FiUploadCloud className="mx-auto text-slate-400 mb-2" size={32} />
                  <p className="text-xs text-slate-500">Click to upload image</p>
                </div>
              )}
              <input id="fileInput" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </div>
            <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
              *Upload a high-resolution image (16:9). Recommended size: 1280x720px.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Form Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Course Title</label>
              <input 
                type="text" 
                placeholder="e.g. Master React in 30 Days"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea 
                rows="4"
                placeholder="What will students learn in this course?"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <input 
                  type="text" 
                  placeholder="e.g. Development"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹)</label>
                <input 
                  type="number" 
                  placeholder="499"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={form.price}
                  onChange={(e) => setForm({...form, price: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty Level</label>
              <select 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
                value={form.courseLevel}
                onChange={(e) => setForm({...form, courseLevel: e.target.value})}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 rounded-xl font-semibold text-slate-500 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-10 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Course"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

export default CreateCourse;