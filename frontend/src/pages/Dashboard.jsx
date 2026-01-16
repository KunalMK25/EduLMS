import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                let response;
                if (user?.role === 'instructor') {
                    response = await axios.get('http://localhost:5000/api/courses/my-created-courses', config);
                    setCourses(Array.isArray(response.data) ? response.data : []);
                } else if (user?.role === 'student') {
                    response = await axios.get('http://localhost:5000/api/courses/my-enrolled-courses', config);
                    setCourses(Array.isArray(response.data) ? response.data : []);
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const handleDeleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/courses/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(courses.filter(course => course._id !== id));
            } catch (error) {
                console.error("Error deleting course:", error);
                alert('Failed to delete course');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Hello, {user?.name}</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Instructor View */}
            {user?.role === 'instructor' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Your Created Courses</h2>
                        <Link to="/create-course" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                            Create New Course
                        </Link>
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (Array.isArray(courses) && courses.length > 0) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map(course => (
                                <div key={course._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                                    {course.thumbnail && (
                                        <img
                                            src={`http://localhost:5000${course.thumbnail}`}
                                            alt={course.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                                        <p className="text-gray-600 mb-4">
                                            {course.description ? (course.description.length > 100 ? `${course.description.substring(0, 100)}...` : course.description) : 'No description'}
                                        </p>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-indigo-600 font-bold">₹{course.price}</span>
                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                Students: {course.enrollmentCount || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-4 text-sm">
                                            <Link to={`/course/${course._id}`} className="text-indigo-600 hover:underline">View Course</Link>
                                            <Link to={`/course/${course._id}/students`} className="text-blue-600 hover:underline">View Students</Link>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link
                                                to={`/edit-course/${course._id}`}
                                                className="flex-1 bg-indigo-100 text-indigo-700 py-2 rounded-md hover:bg-indigo-200 transition text-center"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteCourse(course._id)}
                                                className="flex-1 bg-red-100 text-red-600 py-2 rounded-md hover:bg-red-200 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <p className="text-gray-600">You haven't created any courses yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Student View */}
            {user?.role === 'student' && (
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Enrolled Courses</h2>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (Array.isArray(courses) && courses.length > 0) ? (
                        <div className="space-y-6">
                            {courses.map(enrollment => {
                                const course = enrollment.course;
                                if (!course) return null;

                                const totalLessons = course.lessons?.length || 0;
                                const completedLessons = enrollment.completedLessons?.length || 0;

                                const totalQuizzes = course.quizzes?.length || 0;
                                const completedQuizzes = enrollment.completedQuizzes?.length || 0;

                                const totalAssignments = course.assignments?.length || 0;
                                const submittedAssignments = enrollment.submittedAssignments?.length || 0;

                                return (
                                    <div key={enrollment._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">{course.title}</h3>
                                                <p className="text-gray-600">{course.description?.substring(0, 150)}...</p>
                                            </div>
                                            <Link to={`/course/${course._id}`} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 font-semibold">
                                                Continue Learning
                                            </Link>
                                        </div>

                                        <div className="mb-6">
                                            <div className="flex justify-between text-sm font-medium mb-1">
                                                <span>Overall Progress</span>
                                                <span>{enrollment.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div className="bg-indigo-600 h-3 rounded-full transaction-all duration-300" style={{ width: `${enrollment.progress}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <h4 className="font-semibold text-blue-800 mb-2">Lessons</h4>
                                                <p className="text-3xl font-bold text-blue-600">{completedLessons} <span className="text-lg text-blue-400">/ {totalLessons}</span></p>
                                                <p className="text-sm text-blue-600 mt-1">Completed</p>
                                            </div>
                                            <div className="bg-purple-50 p-4 rounded-lg">
                                                <h4 className="font-semibold text-purple-800 mb-2">Quizzes</h4>
                                                <p className="text-3xl font-bold text-purple-600">{completedQuizzes} <span className="text-lg text-purple-400">/ {totalQuizzes}</span></p>
                                                <p className="text-sm text-purple-600 mt-1">Completed</p>
                                                {enrollment.completedQuizzes?.length > 0 && (
                                                    <div className="mt-2 text-xs text-purple-700">
                                                        Last Score: {Math.round(enrollment.completedQuizzes[enrollment.completedQuizzes.length - 1].score)}%
                                                    </div>
                                                )}
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <h4 className="font-semibold text-green-800 mb-2">Assignments</h4>
                                                <p className="text-3xl font-bold text-green-600">{submittedAssignments} <span className="text-lg text-green-400">/ {totalAssignments}</span></p>
                                                <p className="text-sm text-green-600 mt-1">Submitted</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
                            <p className="text-gray-600 text-lg mb-4">You are not enrolled in any courses yet.</p>
                            <Link to="/courses" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 font-semibold">Browse Courses</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
