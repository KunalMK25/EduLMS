import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, Sun, Moon, Menu, X, ArrowLeft } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const toggleTheme = () => setDarkMode(!darkMode);

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {location.pathname !== '/' && (
                            <button
                                onClick={handleGoBack}
                                className="mr-4 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                        )}
                        <Link to="/" className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                            <BookOpen className="w-8 h-8 mr-2" />
                            <span>EduLMS</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">Home</Link>
                        <Link to="/courses" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">Courses</Link>
                        <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">About</Link>

                        <button onClick={toggleTheme} className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {!user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 font-medium">Login</Link>
                                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Register</Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 font-medium">
                                    Dashboard <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full ml-1 dark:bg-indigo-900 dark:text-indigo-200">{user.role}</span>
                                </Link>
                                <button onClick={handleLogout} className="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-500">
                                    <LogOut className="w-5 h-5 mr-1" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleTheme} className="text-gray-700 dark:text-gray-300 mr-4 focus:outline-none">
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 dark:text-gray-300 focus:outline-none">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 px-4 pt-2 pb-4 space-y-2 shadow-lg">
                    <Link to="/" className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 py-2">Home</Link>
                    <Link to="/courses" className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 py-2">Courses</Link>
                    <Link to="/about" className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 py-2">About</Link>
                    {!user ? (
                        <>
                            <Link to="/login" className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 py-2">Login</Link>
                            <Link to="/register" className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 mt-2">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 py-2">Dashboard</Link>
                            <button onClick={handleLogout} className="flex items-center w-full text-left text-gray-700 dark:text-gray-300 hover:text-red-500 py-2">
                                <LogOut className="w-5 h-5 mr-2" /> Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
