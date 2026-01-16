import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Zap } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
            {/* Hero Section */}
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 dark:text-gray-400 ring-1 ring-gray-900/10 dark:ring-gray-700/50 hover:ring-gray-900/20 dark:hover:ring-gray-700">
                            Announcing our new summer courses. <a href="/courses" className="font-semibold text-indigo-600 dark:text-indigo-400"><span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></a>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                        Empower Your Learning Journey with EduLMS
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Unlock your potential with our expert-led courses. Whether you're a student looking to gain new skills or an instructor ready to share your knowledge, EduLMS is your platform for success.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link to="/register" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Get started
                        </Link>
                        <Link to="/courses" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                            Browse Courses <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24 sm:pb-32">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">Learn Faster</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Everything you need to master new skills
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Our platform is designed to provide seamless interaction between instructors and students.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <BookOpen className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                Diverse Courses
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                                Access a wide range of courses from programming to design, marketing, and more.
                            </dd>
                        </div>
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <Users className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                Expert Instructors
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                                Learn from industry experts who are passionate about teaching and mentoring.
                            </dd>
                        </div>
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <Award className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                Certification
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                                Earn certificates upon completion to showcase your achievements to the world.
                            </dd>
                        </div>
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <Zap className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                Interactive Learning
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                                Engage with video lessons, quizzes, and assignments to reinforce your knowledge.
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default Home;
