import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import confetti from 'canvas-confetti';
import { FaPython, FaJava, FaJs, FaCode } from 'react-icons/fa';

const Logo = () => (
    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const FloatingIcon = ({ icon: Icon, delay }) => {
    const props = useSpring({
        loop: true,
        to: [
            { transform: 'translateY(0px)' },
            { transform: 'translateY(-20px)' },
            { transform: 'translateY(0px)' },
        ],
        from: { transform: 'translateY(0px)' },
        config: { duration: 2000 },
        delay: delay,
    });

    return (
        <animated.div style={props} className="absolute text-4xl text-yellow-300">
            <Icon />
        </animated.div>
    );
};

const ClickableStar = ({ onClick }) => {
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(true);
        onClick();
        setTimeout(() => setClicked(false), 1000);
    };

    return (
        <motion.div
            className={`cursor-pointer text-4xl ${clicked ? 'text-yellow-500' : 'text-yellow-300'}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={handleClick}
        >
            ⭐
        </motion.div>
    );
};

const LanguageCard = ({ id, name, icon: Icon, description, onClick }) => (
    <motion.div
        className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl shadow-lg overflow-hidden cursor-pointer relative"
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onClick(id)}
    >
        <div className="p-6 flex flex-col items-center">
            <Icon className="text-6xl mb-4 text-yellow-300" />
            <h2 className="text-2xl font-bold mb-2 text-white">{name}</h2>
            <p className="text-indigo-100 text-center">{description}</p>
        </div>
        <motion.div
            className="absolute top-2 right-2 bg-yellow-400 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center font-bold"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
        >
            XP
        </motion.div>
    </motion.div>
);

const LanguageSelectionPage = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [starCount, setStarCount] = useState(0);

    const languages = [
        { id: 'python', name: 'Python', icon: FaPython, description: 'Master Python and conquer the coding world!' },
        { id: 'java', name: 'Java', icon: FaJava, description: 'Build powerful apps with Java mastery!' },
        { id: 'javascript', name: 'JavaScript', icon: FaJs, description: 'Create amazing web experiences with JS!' },
        { id: 'cpp', name: 'C++', icon: FaCode, description: 'Dive into C++ and unlock high performance!' },
    ];

    const handleLanguageSelect = (languageId) => {
        // confetti({
        //     particleCount: 100,
        //     spread: 70,
        //     origin: { y: 0.6 }
        // });
        navigate(`/curriculum/${languageId}`);
    };

    const handleLoginToggle = () => {
        setIsLoggedIn(!isLoggedIn);
    };

    const handleStarClick = () => {
        setStarCount(prevCount => prevCount + 1);
        confetti({
            particleCount: 20,
            spread: 50,
            origin: { y: 0.8 }
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const randomLanguage = languages[Math.floor(Math.random() * languages.length)];
            confetti({
                particleCount: 10,
                angle: Math.random() * 360,
                spread: 70,
                origin: { x: Math.random(), y: Math.random() },
                colors: ['#FFD700', '#FFA500', '#FF4500']
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-12 relative z-10">
                    <div className="flex items-center">
                        <Logo />
                        <h1 className="ml-4 text-4xl font-extrabold text-white">CodeQuest</h1>
                    </div>
                    <nav className="flex items-center">
                        <div className="mr-4 flex items-center bg-yellow-400 text-purple-700 px-3 py-1 rounded-full">
                            <span className="font-bold mr-2">⭐ {starCount}</span>
                        </div>
                        <button className="text-yellow-300 hover:text-yellow-100 font-semibold mr-4">
                            Leaderboard
                        </button>
                        <motion.button
                            onClick={handleLoginToggle}
                            className="bg-yellow-400 text-purple-700 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-300 transition duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isLoggedIn ? 'Logout' : 'Login'}
                        </motion.button>
                    </nav>
                </header>

                <main className="space-y-16 relative z-10">
                    <section className="text-center">
                        <motion.h2
                            className="text-5xl font-extrabold text-white mb-4"
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Choose Your Coding Adventure!
                        </motion.h2>
                        <motion.p
                            className="text-xl text-indigo-100 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Embark on an epic journey to become a coding legend. Pick your language and start your quest!
                        </motion.p>
                    </section>

                    <section>
                        <AnimatePresence>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {languages.map((language, index) => (
                                    <motion.div
                                        key={language.id}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -50 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <LanguageCard
                                            {...language}
                                            onClick={handleLanguageSelect}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatePresence>
                    </section>

                    <section className="bg-white bg-opacity-10 rounded-xl p-8">
                        <h3 className="text-3xl font-bold text-white mb-6">Top Adventurers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { name: 'Dragon Coder', score: 15000, avatar: '🐉' },
                                { name: 'Pixel Wizard', score: 14500, avatar: '🧙' },
                                { name: 'Binary Knight', score: 14000, avatar: '🐴' },
                            ].map((player, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-purple-600 rounded-lg p-4 flex items-center"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="text-4xl mr-4">{player.avatar}</div>
                                    <div>
                                        <p className="font-bold text-white">{player.name}</p>
                                        <p className="text-yellow-300">{player.score} pts</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="mt-16 text-center text-indigo-100">
                    <p>&copy; 2024 CodeQuest. All rights reserved.</p>
                </footer>
            </div>

            {/* Floating icons */}
            <div className="absolute top-1/4 left-1/4"><FloatingIcon icon={FaPython} delay={0} /></div>
            <div className="absolute top-1/3 right-1/4"><FloatingIcon icon={FaJava} delay={500} /></div>
            <div className="absolute bottom-1/4 left-1/3"><FloatingIcon icon={FaJs} delay={1000} /></div>
            <div className="absolute bottom-1/3 right-1/3"><FloatingIcon icon={FaCode} delay={1500} /></div>

            {/* Clickable stars */}
            <div className="absolute top-1/2 left-10"><ClickableStar onClick={handleStarClick} /></div>
            <div className="absolute bottom-1/4 right-10"><ClickableStar onClick={handleStarClick} /></div>
            <div className="absolute top-1/4 right-1/4"><ClickableStar onClick={handleStarClick} /></div>
        </div>
    );
};

export default LanguageSelectionPage;