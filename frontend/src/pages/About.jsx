const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-indigo-600 dark:text-indigo-400">About EduLMS</h1>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 text-lg leading-relaxed">
                    <p className="mb-6">
                        Welcome to <strong>EduLMS</strong>, a comprehensive Learning Management System designed to bridge the gap between educators and learners.
                        Our mission is to democratize education by providing a robust platform where knowledge knows no boundaries.
                    </p>
                    <p className="mb-6">
                        Whether you are an instructor looking to share your expertise with the world or a student eager to acquire new skills,
                        EduLMS offers the tools you need to succeed. With features like easy course creation, progress tracking, and interactive lessons,
                        learning has never been more accessible.
                    </p>
                    <p>
                        Built with modern technologies like the MERN stack (MongoDB, Express, React, Node.js), our platform ensures a fast, secure,
                        and seamless user experience. Join us today and be part of the future of education!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">For Instructors</h3>
                        <p className="text-gray-600 dark:text-gray-300">Create global courses, manage students, and track performance effortlessly.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">For Students</h3>
                        <p className="text-gray-600 dark:text-gray-300">Access diverse courses, learn at your own pace, and earn certifications.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">Community</h3>
                        <p className="text-gray-600 dark:text-gray-300">Connect with peers, share knowledge, and grow together.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
