import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CourseView = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);
    const [activeLesson, setActiveLesson] = useState(null);

    // Add Lesson Form State
    const [showAddLesson, setShowAddLesson] = useState(false);
    const [lessonForm, setLessonForm] = useState({ title: '', type: 'video', content: '', duration: 0, isFree: false });
    const [uploading, setUploading] = useState(false);

    // NEW STATES START HERE
    const [activeTab, setActiveTab] = useState('lessons');
    // Content state
    const [quizForm, setQuizForm] = useState({ title: '', questions: [] }); // Instructor
    const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', dueDate: '' }); // Instructor

    // Student interaction state
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [activeAssignment, setActiveAssignment] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState({}); // { 0: 1, 1: 0 } questionIndex: optionIndex
    const [assignmentContent, setAssignmentContent] = useState('');
    // NEW STATES END HERE

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/courses/${id}`);
                setCourse(data);
                if (data.lessons.length > 0) setActiveLesson(data.lessons[0]);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        const checkEnrollment = async () => {
            if (user?.role === 'student') {
                try {
                    const { data } = await axios.get(`http://localhost:5000/api/courses/${id}/enrollment`, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    setEnrolled(data.enrolled);
                } catch (error) {
                    console.error("Error checking enrollment:", error);
                }
            }
        };

        fetchCourse();
        if (user) checkEnrollment();
    }, [id, user]);

    const handleEnroll = async () => {
        try {
            await axios.post(`http://localhost:5000/api/courses/${id}/enroll`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setEnrolled(true);
            alert('Enrolled successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Enrollment failed');
        }
    };

    const handleLessonUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setLessonForm(prev => ({ ...prev, content: data }));
            setUploading(false);
        } catch (error) {
            setUploading(false);
            alert('Upload failed');
        }
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`http://localhost:5000/api/courses/${id}/lessons`, lessonForm, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setCourse(data); // Update course with new lesson
            setShowAddLesson(false);
            setLessonForm({ title: '', type: 'video', content: '', duration: 0, isFree: false });
        } catch (error) {
            alert('Failed to add lesson');
        }
    };

    // NEW HANDLERS START HERE
    const handleAddQuiz = async (e) => {
        e.preventDefault();
        // Simplified for brevity: Assuming user manually enters JSON for questions or similar
        // Ideally needs a dynamic form builder
        try {
            const { data } = await axios.post(`http://localhost:5000/api/courses/${id}/quizzes`, quizForm, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setCourse(data);
            alert('Quiz added');
        } catch (error) {
            alert('Failed to add quiz');
        }
    };

    const handleSubmitQuiz = async () => {
        try {
            // Convert answers object to array
            const answersArray = activeQuiz.questions.map((_, i) => quizAnswers[i]);
            const { data } = await axios.post(`http://localhost:5000/api/courses/${id}/quizzes/${activeQuiz._id}/submit`, { answers: answersArray }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert(`Quiz Submitted! Score: ${Math.round(data.score)}%`);
            setActiveQuiz(null);
        } catch (error) {
            alert('Submission failed');
        }
    };
    // NEW HANDLERS END HERE

    if (loading) return <div>Loading...</div>;
    if (!course) return <div>Course not found</div>;

    const isInstructor = user?.role === 'instructor' || user?.role === 'admin';
    // Simplified enrollment check: user can see content if instructor or enrolled (client side check handled by server usually)

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="p-8">
                    <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                    <p className="text-gray-600 mb-6">{course.description}</p>
                    <div className="flex items-center space-x-4">
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">{course.category}</span>
                        <span className="text-2xl font-bold text-gray-900">₹{course.price}</span>
                    </div>

                    {!isInstructor && (
                        enrolled ? (
                            <button disabled className="mt-6 bg-gray-400 text-white px-8 py-3 rounded-lg font-bold cursor-not-allowed">
                                Enrolled
                            </button>
                        ) : (
                            <button onClick={handleEnroll} className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700">
                                Enroll Now
                            </button>
                        )
                    )}
                </div>
            </div>

            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('lessons')}
                    className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'lessons' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Lessons
                </button>
                <button
                    onClick={() => setActiveTab('quizzes')}
                    className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'quizzes' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Quizzes
                </button>
                <button
                    onClick={() => setActiveTab('assignments')}
                    className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'assignments' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Assignments
                </button>
            </div>

            {activeTab === 'lessons' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {activeLesson ? (
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-2xl font-bold mb-4">{activeLesson.title}</h2>
                                {activeLesson.type === 'video' && <video controls className="w-full rounded-lg" src={`http://localhost:5000${activeLesson.content}`} />}
                                {activeLesson.type === 'pdf' && <iframe src={`http://localhost:5000${activeLesson.content}`} className="w-full h-96 rounded-lg"></iframe>}
                                {activeLesson.type === 'text' && <p className="text-gray-700 whitespace-pre-wrap">{activeLesson.content}</p>}
                            </div>
                        ) : <div className="text-center py-12 text-gray-500">Select a lesson</div>}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Content</h3>
                                {isInstructor && <button onClick={() => setShowAddLesson(!showAddLesson)} className="text-indigo-600 text-sm font-semibold">+ Add</button>}
                            </div>
                            {showAddLesson && (
                                <form onSubmit={handleAddLesson} className="mb-6 p-4 bg-gray-50 rounded-lg border">
                                    <input placeholder="Title" className="w-full mb-2 p-2 border rounded" value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} required />
                                    <select className="w-full mb-2 p-2 border rounded" value={lessonForm.type} onChange={e => setLessonForm({ ...lessonForm, type: e.target.value })}>
                                        <option value="video">Video</option>
                                        <option value="pdf">PDF</option>
                                        <option value="text">Text</option>
                                    </select>
                                    {lessonForm.type !== 'text' ? <input type="file" onChange={handleLessonUpload} className="mb-2" /> : <textarea placeholder="Content" className="w-full mb-2 p-2 border rounded" value={lessonForm.content} onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })} />}
                                    <button type="submit" disabled={uploading} className="w-full bg-green-600 text-white py-2 rounded">{uploading ? 'Uploading...' : 'Add Lesson'}</button>
                                </form>
                            )}
                            <div className="space-y-2">
                                {course.lessons.map((lesson, idx) => (
                                    <div key={idx} className="flex justify-between items-center group">
                                        <button onClick={() => setActiveLesson(lesson)} className={`flex-1 text-left p-3 rounded ${activeLesson === lesson ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-50'}`}>
                                            <span className="font-bold mr-2">{idx + 1}.</span> {lesson.title}
                                        </button>
                                        {isInstructor && (
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (!window.confirm('Delete lesson?')) return;
                                                    try {
                                                        await axios.delete(`http://localhost:5000/api/courses/${id}/lessons/${lesson._id}`, {
                                                            headers: { Authorization: `Bearer ${user.token}` }
                                                        });
                                                        setCourse(prev => ({ ...prev, lessons: prev.lessons.filter(l => l._id !== lesson._id) }));
                                                        if (activeLesson?._id === lesson._id) setActiveLesson(null);
                                                    } catch (err) { alert('Failed to delete'); }
                                                }}
                                                className="hidden group-hover:block text-red-500 px-2"
                                            >
                                                &times;
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'quizzes' && (
                <div className="max-w-3xl mx-auto">
                    {activeQuiz ? (
                        <div className="bg-white p-8 rounded-lg shadow">
                            <h2 className="text-2xl font-bold mb-6">{activeQuiz.title}</h2>
                            {activeQuiz.questions.map((q, qIdx) => (
                                <div key={qIdx} className="mb-6">
                                    <p className="font-medium mb-2">{qIdx + 1}. {q.question}</p>
                                    <div className="space-y-2 ml-4">
                                        {q.options.map((opt, oIdx) => (
                                            <label key={oIdx} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`q-${qIdx}`}
                                                    value={oIdx}
                                                    onChange={() => setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })}
                                                    checked={quizAnswers[qIdx] === oIdx}
                                                />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-end space-x-4">
                                <button onClick={() => setActiveQuiz(null)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                                <button onClick={handleSubmitQuiz} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Submit Quiz</button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-8">
                            {/* Quiz List */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold border-b pb-2">Available Quizzes</h3>
                                {course.quizzes?.length > 0 ? course.quizzes.map((quiz, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
                                        <div>
                                            <h4 className="text-lg font-bold">{quiz.title}</h4>
                                            <p className="text-sm text-gray-500">{quiz.questions.length} Questions</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => setActiveQuiz(quiz)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Start Quiz</button>
                                            {isInstructor && (
                                                <button
                                                    onClick={async () => {
                                                        if (!window.confirm('Delete quiz?')) return;
                                                        try {
                                                            await axios.delete(`http://localhost:5000/api/courses/${id}/quizzes/${quiz._id}`, {
                                                                headers: { Authorization: `Bearer ${user.token}` }
                                                            });
                                                            setCourse(prev => ({ ...prev, quizzes: prev.quizzes.filter(q => q._id !== quiz._id) }));
                                                        } catch (err) { alert('Failed to delete'); }
                                                    }}
                                                    className="bg-red-100 text-red-600 px-3 py-2 rounded hover:bg-red-200"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )) : <p className="text-gray-500 italic">No quizzes yet.</p>}
                            </div>

                            {/* Instructor Create Quiz Form */}
                            {isInstructor && (
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-xl font-bold mb-4 text-indigo-800">Create New Quiz</h3>
                                    <form onSubmit={handleAddQuiz}>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Quiz Title</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded"
                                                value={quizForm.title}
                                                onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                                                placeholder="e.g., Chapter 1 Review"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Questions JSON</label>
                                            <p className="text-xs text-gray-500 mb-2">
                                                Paste your questions in this format:
                                                <code className="block bg-gray-200 p-1 my-1 rounded">
                                                    [&#123;"question": "Q1?", "options": ["A","B"], "correctAnswer": 0&#125;]
                                                </code>
                                            </p>
                                            <textarea
                                                className="w-full p-2 border rounded font-mono text-sm"
                                                rows="6"
                                                placeholder='[{"question": "What is 2+2?", "options": ["3", "4", "5"], "correctAnswer": 1}]'
                                                onChange={e => {
                                                    try {
                                                        const questions = JSON.parse(e.target.value);
                                                        setQuizForm({ ...quizForm, questions });
                                                    } catch (err) {
                                                        // Handle invalid JSON visibly if needed, or just let it fail on submit
                                                    }
                                                }}
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Create Quiz</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'assignments' && (
                <div className="max-w-3xl mx-auto">
                    <div className="grid gap-8">
                        {/* Assignment List */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold border-b pb-2">Assignments</h3>
                            {course.assignments?.length > 0 ? course.assignments.map((assignment, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-lg shadow relative">
                                    {isInstructor && (
                                        <button
                                            onClick={async () => {
                                                if (!window.confirm('Delete assignment?')) return;
                                                try {
                                                    await axios.delete(`http://localhost:5000/api/courses/${id}/assignments/${assignment._id}`, {
                                                        headers: { Authorization: `Bearer ${user.token}` }
                                                    });
                                                    setCourse(prev => ({ ...prev, assignments: prev.assignments.filter(a => a._id !== assignment._id) }));
                                                } catch (err) { alert('Failed to delete'); }
                                            }}
                                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold"
                                        >
                                            Delete
                                        </button>
                                    )}
                                    <h3 className="text-xl font-bold mb-2">{assignment.title}</h3>
                                    <p className="text-gray-600 mb-4">{assignment.description}</p>

                                    {/* Student Submission Form - Only show if student */}
                                    {!isInstructor && (
                                        <div className="mt-4 border-t pt-4">
                                            <p className="text-sm font-semibold mb-2">Submit Your Work</p>
                                            <textarea
                                                className="w-full border rounded p-2 mb-2"
                                                rows="3"
                                                placeholder="Type your submission here... (or paste a URL)"
                                                onChange={(e) => setAssignmentContent(e.target.value)}
                                            ></textarea>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await axios.post(`http://localhost:5000/api/courses/${id}/assignments/${assignment._id}/submit`, { content: assignmentContent }, { headers: { Authorization: `Bearer ${user.token}` } });
                                                        alert('Assignment Submitted!');
                                                        setAssignmentContent('');
                                                    } catch (e) { alert('Failed'); }
                                                }}
                                                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                                            >
                                                Submit Assignment
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )) : <p className="text-gray-500 italic">No assignments yet.</p>}
                        </div>

                        {/* Instructor Create Assignment Form */}
                        {isInstructor && (
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="text-xl font-bold mb-4 text-indigo-800">Post New Assignment</h3>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        const { data } = await axios.post(`http://localhost:5000/api/courses/${id}/assignments`, assignmentForm, {
                                            headers: { Authorization: `Bearer ${user.token}` }
                                        });
                                        setCourse(data);
                                        setAssignmentForm({ title: '', description: '', dueDate: '' });
                                        alert('Assignment posted!');
                                    } catch (err) { alert('Failed to post assignment'); }
                                }}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded"
                                            value={assignmentForm.title}
                                            onChange={e => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                        <textarea
                                            className="w-full p-2 border rounded"
                                            rows="3"
                                            value={assignmentForm.description}
                                            onChange={e => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Create Assignment</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseView;

