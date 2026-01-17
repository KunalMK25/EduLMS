import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api.js";

const CourseCreate = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    thumbnail: "",
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/api/courses",
        formData,
        {
           headers: {
           Authorization: `Bearer ${localStorage.getItem("token")}`}
        }
    );

      navigate("/dashboard");
    } catch {
      alert("Failed to create course");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Course</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Course Title</label>
          <input
            type="text"
            name="title"
            required
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            required
            className="w-full border p-2 rounded h-32"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Category</label>
          <input
            type="text"
            name="category"
            required
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Price (₹)</label>
          <input
            type="number"
            name="price"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Thumbnail Image URL
          </label>
          <input
            type="text"
            name="thumbnail"
            placeholder="https://images.unsplash.com/..."
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CourseCreate;
