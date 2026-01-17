import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";

const CourseView = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [activeLesson, setActiveLesson] = useState(null);

  const [showAddLesson, setShowAddLesson] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    type: "video",
    content: "",
    duration: 0,
    isFree: false,
  });
  const [uploading, setUploading] = useState(false);

  const [activeTab, setActiveTab] = useState("lessons");
  const [quizForm, setQuizForm] = useState({ title: "", questions: [] });
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [assignmentContent, setAssignmentContent] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/api/courses/${id}`);
        setCourse(data);
        if (data.lessons?.length > 0) setActiveLesson(data.lessons[0]);
      } finally {
        setLoading(false);
      }
    };

    const checkEnrollment = async () => {
      if (user?.role === "student") {
        try {
          const { data } = await api.get(
            `/api/courses/${id}/enrollment`
          );
          setEnrolled(data.enrolled);
        } catch {}
      }
    };

    fetchCourse();
    if (user) checkEnrollment();
  }, [id, user]);

  const handleEnroll = async () => {
    try {
      await api.post(`/api/courses/${id}/enroll`);
      setEnrolled(true);
    } catch {
      alert("Enrollment failed");
    }
  };

  const handleLessonUpload = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    setUploading(true);
    try {
      const res = await api.post("/api/upload", data);
      setLessonForm((p) => ({ ...p, content: res.data }));
    } finally {
      setUploading(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(
        `/api/courses/${id}/lessons`,
        lessonForm
      );
      setCourse(data);
      setShowAddLesson(false);
      setLessonForm({
        title: "",
        type: "video",
        content: "",
        duration: 0,
        isFree: false,
      });
    } catch {
      alert("Failed to add lesson");
    }
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(
        `/api/courses/${id}/quizzes`,
        quizForm
      );
      setCourse(data);
    } catch {
      alert("Failed to add quiz");
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const answers = activeQuiz.questions.map((_, i) => quizAnswers[i]);
      const { data } = await api.post(
        `/api/courses/${id}/quizzes/${activeQuiz._id}/submit`,
        { answers }
      );
      alert(`Quiz Submitted! Score: ${Math.round(data.score)}%`);
      setActiveQuiz(null);
    } catch {
      alert("Submission failed");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  const isInstructor = user?.role === "instructor" || user?.role === "admin";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg mb-8 p-8">
        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-6">{course.description}</p>
        <div className="flex space-x-4">
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
            {course.category}
          </span>
          <span className="text-2xl font-bold">₹{course.price}</span>
        </div>

        {!isInstructor &&
          (enrolled ? (
            <button className="mt-6 bg-gray-400 text-white px-8 py-3 rounded-lg">
              Enrolled
            </button>
          ) : (
            <button
              onClick={handleEnroll}
              className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-lg"
            >
              Enroll Now
            </button>
          ))}
      </div>

      <div className="flex border-b mb-6">
        {["lessons", "quizzes", "assignments"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-6 py-3 ${
              activeTab === t
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "lessons" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            {activeLesson && (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  {activeLesson.title}
                </h2>
                {activeLesson.type === "video" && (
                  <video
                    controls
                    className="w-full"
                    src={activeLesson.content}
                  />
                )}
                {activeLesson.type === "pdf" && (
                  <iframe
                    className="w-full h-96"
                    src={activeLesson.content}
                  />
                )}
                {activeLesson.type === "text" && (
                  <p>{activeLesson.content}</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseView;
