import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CourseCreate = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        thumbnail: ''
    });
    const { user } = useAuth();
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, thumbnail: data }));
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('File upload failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/courses', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            navigate('/dashboard');
        } catch (error) {
            alert('Failed to create course');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 mb-2">Course Title</label>
                    <input type="text" name="title" required className="w-full border p-2 rounded" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea name="description" required className="w-full border p-2 rounded h-32" onChange={handleChange}></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Category</label>
                    <input type="text" name="category" required className="w-full border p-2 rounded" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Price (₹)</label>
                    <input type="number" name="price" className="w-full border p-2 rounded" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Thumbnail</label>
                    <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-indigo-50 file:text-indigo-700
      hover:file:bg-indigo-100" />
                    {uploading && <p>Uploading...</p>}
                    {formData.thumbnail && <p className="text-green-600 mt-2">Thumbnail uploaded!</p>}
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Create Course</button>
            </form>
        </div>
    );
};

export default CourseCreate;
