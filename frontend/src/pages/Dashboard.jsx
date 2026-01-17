import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let response;
        if (user?.role === "instructor") {
          response = await api.get("/api/courses/my-created-courses");
          setCourses(Array.isArray(response.data) ? response.data : []);
        } else if (user?.role === "student") {
          response = await api.get("/api/courses/my-enrolled-courses");
          setCourses(Array.isArray(response.data) ? response.data : []);
        }
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/api/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Failed to delete course");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Hello, {user?.name}</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {user?.role === "instructor" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Created Courses</h2>
            <Link
              to="/create-course"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            >
              Create New Course
            </Link>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {course.description?.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between mb-4">
                      <span className="text-indigo-600 font-bold">
                        ₹{course.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        Students: {course.enrollmentCount || 0}
                      </span>
                    </div>
                    <div className="flex justify-between mb-4 text-sm">
                      <Link
                        to={`/course/${course._id}`}
                        className="text-indigo-600"
                      >
                        View Course
                      </Link>
                      <Link
                        to={`/course/${course._id}/students`}
                        className="text-blue-600"
                      >
                        View Students
                      </Link>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/edit-course/${course._id}`}
                        className="flex-1 bg-indigo-100 text-indigo-700 py-2 rounded-md text-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="flex-1 bg-red-100 text-red-600 py-2 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven't created any courses yet.</p>
          )}
        </div>
      )}

      {user?.role === "student" && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            My Enrolled Courses
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : courses.length > 0 ? (
            <div className="space-y-6">
              {courses.map((enrollment) => {
                const course = enrollment.course;
                if (!course) return null;

                return (
                  <div
                    key={enrollment._id}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <div className="flex justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold">
                          {course.title}
                        </h3>
                        <p className="text-gray-600">
                          {course.description?.substring(0, 150)}...
                        </p>
                      </div>
                      <Link
                        to={`/course/${course._id}`}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md"
                      >
                        Continue Learning
                      </Link>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{enrollment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-indigo-600 h-3 rounded-full"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="mb-4">
                You are not enrolled in any courses yet.
              </p>
              <Link
                to="/courses"
                className="bg-indigo-600 text-white px-6 py-2 rounded-md"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
