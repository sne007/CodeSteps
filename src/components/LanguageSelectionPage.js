import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Logo = () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

const LanguageSelectionPage = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const languages = [
        { id: 'python', name: 'Python', description: 'Learn Python basics and data structures', icon: '🐍' },
        { id: 'java', name: 'Java', description: 'Master Java fundamentals and OOP concepts', icon: '☕' },
        { id: 'javascript', name: 'JavaScript', description: 'Explore JavaScript and web development', icon: '🌐' },
        { id: 'cpp', name: 'C++', description: 'Dive into C++ and low-level programming', icon: '⚙️' },
    ];

    const reviews = [
        { id: 1, text: "This platform helped me land my dream job!", author: "Jane D.", company: "Tech Giant Inc.", rating: 5 },
        { id: 2, text: "The interactive lessons made learning to code fun and easy.", author: "John S.", company: "Startup Innovators", rating: 4 },
        { id: 3, text: "I went from complete beginner to confident developer.", author: "Alex M.", company: "Creative Coders LLC", rating: 5 },
    ];

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    const handleLanguageSelect = (languageId) => {
        navigate(`/curriculum/${languageId}`);
    };

    const handleLoginToggle = () => {
        setIsLoggedIn(!isLoggedIn);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center">
                        <Logo />
                        <h1 className="ml-4 text-3xl font-extrabold text-indigo-900">CodeMaster</h1>
                    </div>
                    <nav className="flex items-center">
                        <button className="text-indigo-600 hover:text-indigo-800 font-semibold mr-4">About</button>
                        <button
                            onClick={handleLoginToggle}
                            className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
                        >
                            {isLoggedIn ? 'Logout' : 'Login'}
                        </button>
                    </nav>
                </header>

                <main className="space-y-16">
                    <section className="text-center">
                        <h2 className="text-4xl font-extrabold text-indigo-900 mb-4">Master Coding, One Step at a Time</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            CodeMaster offers interactive, gamified learning experiences to help you build a solid foundation in programming.
                            Choose your language and start your coding journey today!
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-indigo-900 mb-6">Choose Your Coding Path</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {languages.map((language) => (
                                <motion.div
                                    key={language.id}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                                    whileHover={{ y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                >
                                    <div className="p-6">
                                        <div className="text-4xl mb-4">{language.icon}</div>
                                        <h2 className="text-xl font-bold mb-2 text-indigo-900">{language.name}</h2>
                                        <p className="text-gray-600 mb-4">{language.description}</p>
                                        <button
                                            onClick={() => handleLanguageSelect(language.id)}
                                            className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
                                        >
                                            Start Learning
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-indigo-900">What Our Learners Say</h3>
                            <div className="flex items-center">
                                <StarRating rating={Math.round(averageRating)} />
                                <span className="ml-2 text-lg font-semibold text-indigo-900">{averageRating.toFixed(1)} out of 5</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white rounded-xl shadow-lg p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <StarRating rating={review.rating} />
                                        <span className="text-indigo-600 font-semibold">{review.rating}.0</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">"{review.text}"</p>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-3">
                                            {review.author.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-indigo-900">{review.author}</p>
                                            <p className="text-sm text-gray-500">{review.company}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="mt-16 text-center text-gray-600">
                    <p>&copy; 2024 CodeMaster. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default LanguageSelectionPage;