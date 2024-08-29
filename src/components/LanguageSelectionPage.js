import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPython, FaJava, FaJs, FaCode } from 'react-icons/fa';

const Logo = () => (
    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const LanguageCard = ({ id, name, icon: Icon, description, onClick }) => (
    <motion.div
        className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl shadow-lg overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onClick(id)}
    >
        <div className="p-6 flex flex-col items-center">
            <Icon className="text-6xl mb-4 text-yellow-300" />
            <h2 className="text-2xl font-bold mb-2 text-white">{name}</h2>
            <p className="text-indigo-100 text-center">{description}</p>
        </div>
    </motion.div>
);

const LanguageSelectionPage = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const languages = [
        { id: 'python', name: 'Python', icon: FaPython, description: 'Master Python and conquer the coding world!' },
        { id: 'java', name: 'Java', icon: FaJava, description: 'Build powerful apps with Java mastery!' },
        { id: 'javascript', name: 'JavaScript', icon: FaJs, description: 'Create amazing web experiences with JS!' },
        { id: 'cpp', name: 'C++', icon: FaCode, description: 'Dive into C++ and unlock high performance!' },
    ];

    const handleLanguageSelect = (languageId) => {
        navigate(`/curriculum/${languageId}`);
    };

    const handleLoginToggle = () => {
        setIsLoggedIn(!isLoggedIn);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center">
                        <Logo />
                        <h1 className="ml-4 text-4xl font-extrabold text-white">CodeQuest</h1>
                    </div>
                    <nav className="flex items-center">
                        <button className="text-yellow-300 hover:text-yellow-100 font-semibold mr-4">
                            Leaderboard
                        </button>
                        <button
                            onClick={handleLoginToggle}
                            className="bg-yellow-400 text-purple-700 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-300 transition duration-300"
                        >
                            {isLoggedIn ? 'Logout' : 'Login'}
                        </button>
                    </nav>
                </header>

                <main className="space-y-16">
                    <section className="text-center">
                        <h2 className="text-5xl font-extrabold text-white mb-4">
                            Choose Your Coding Adventure!
                        </h2>
                        <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                            Embark on an epic journey to become a coding legend. Pick your language and start your quest!
                        </p>
                    </section>

                    <section>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {languages.map((language) => (
                                <LanguageCard
                                    key={language.id}
                                    {...language}
                                    onClick={handleLanguageSelect}
                                />
                            ))}
                        </div>
                    </section>

                    <section className="bg-white bg-opacity-10 rounded-xl p-8">
                        <h3 className="text-3xl font-bold text-white mb-6">Top Adventurers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { name: 'Dragon Coder', score: 15000, avatar: '🐉' },
                                { name: 'Pixel Wizard', score: 14500, avatar: '🧙' },
                                { name: 'Binary Knight', score: 14000, avatar: '🐴' },
                            ].map((player, index) => (
                                <div key={index} className="bg-purple-600 rounded-lg p-4 flex items-center">
                                    <div className="text-4xl mr-4">{player.avatar}</div>
                                    <div>
                                        <p className="font-bold text-white">{player.name}</p>
                                        <p className="text-yellow-300">{player.score} pts</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="mt-16 text-center text-indigo-100">
                    <p>&copy; 2024 CodeQuest. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default LanguageSelectionPage;