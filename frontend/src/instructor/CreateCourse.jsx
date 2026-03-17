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
    price: ""
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

    if (!form.title || !form.description || !form.category || !form.price) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const res = await axiosInstance.post(
        "/instructor-api/create-course",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res.data.message || "Course created!");
      navigate("/instructor-dashboard");

    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to create course");
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

          {/* THUMBNAIL */}
          <div className="bg-white p-6 rounded-xl">
            <label className="font-bold mb-2 flex items-center gap-2">
              <FiImage /> Thumbnail
            </label>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed p-6 text-center cursor-pointer"
            >
              {preview ? (
                <img src={preview} className="w-full h-40 object-cover" />
              ) : (
                <p>Drag & drop or click</p>
              )}

              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white p-6 rounded-xl space-y-4">

            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <select
              value={form.courseLevel}
              onChange={(e) => setForm({ ...form, courseLevel: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>

            <input
              type="number"
              placeholder="Price ₹"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border p-2 rounded"
            />

          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 text-white p-3 rounded"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Course"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateCourse;