import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/courses');
                setCourses(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) return <div className="text-center py-10">Loading courses...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                        {course.thumbnail && (
                            <img
                                src={`http://localhost:5000${course.thumbnail}`}
                                alt={course.title}
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                            <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-indigo-600 font-semibold">{course.price ? `₹${course.price}` : 'Free'}</span>
                                <Link to={`/course/${course._id}`} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseList;
