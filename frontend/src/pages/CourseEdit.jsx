import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CourseEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        thumbnail: ''
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/courses/${id}`);
                setFormData({
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    price: data.price,
                    thumbnail: data.thumbnail
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching course:", error);
                alert("Failed to fetch course details");
                navigate('/dashboard');
            }
        };
        fetchCourse();
    }, [id, navigate]);

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
            await axios.put(`http://localhost:5000/api/courses/${id}`, formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            navigate('/dashboard');
        } catch (error) {
            console.error("Error updating course:", error);
            alert('Failed to update course');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 mb-2">Course Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="w-full border p-2 rounded"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        required
                        className="w-full border p-2 rounded h-32"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Category</label>
                    <input
                        type="text"
                        name="category"
                        required
                        className="w-full border p-2 rounded"
                        value={formData.category}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Price (₹)</label>
                    <input
                        type="number"
                        name="price"
                        className="w-full border p-2 rounded"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Thumbnail</label>
                    {formData.thumbnail && (
                        <div className="mb-2">
                            <img src={`http://localhost:5000${formData.thumbnail}`} alt="Current Thumbnail" className="w-32 h-20 object-cover rounded" />
                        </div>
                    )}
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
                    />
                    {uploading && <p>Uploading...</p>}
                </div>
                <div className="flex space-x-4">
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Update Course</button>
                    <button type="button" onClick={() => navigate('/dashboard')} className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default CourseEdit;
