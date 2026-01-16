import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseCreate from './pages/CourseCreate';
import CourseList from './pages/CourseList';
import CourseView from './pages/CourseView';
import CourseEdit from './pages/CourseEdit';
import { useAuth } from './context/AuthContext';
import CourseStudents from './pages/CourseStudents';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-course"
          element={
            <PrivateRoute>
              <CourseCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-course/:id"
          element={
            <PrivateRoute>
              <CourseEdit />
            </PrivateRoute>
          }
        />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseView />} />
        <Route
          path="/course/:id/students"
          element={
            <PrivateRoute>
              <CourseStudents />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
