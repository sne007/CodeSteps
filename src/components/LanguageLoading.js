import React from 'react';
import { motion } from 'framer-motion';
import { FaPython, FaJava, FaJs, FaCode } from 'react-icons/fa';

const LanguageLoadingAnimation = ({ languageId }) => {
    const getLanguageIcon = () => {
        switch (languageId.toLowerCase()) {
            case 'python':
                return <FaPython size={80} className="text-yellow-500" />;
            case 'java':
                return <FaJava size={80} className="text-yellow-500" />;
            case 'javascript':
                return <FaJs size={80} className="text-yellow-500" />;
            default:
                return <FaCode size={80} className="text-yellow-500" />;
        }
    };

    return (
        <div className={`${languageId.toLowerCase()}-loading-container flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500`}>
            <motion.div
                className="language-logo"
                animate={{
                    rotateY: [0, 360],
                    scale: [1, 1.4, 1],
                }}
                transition={{
                    duration: 1,
                    ease: "easeInOut",
                    times: [0, 0.5, 1],
                    repeat: Infinity,
                }}
            >
                {getLanguageIcon()}
            </motion.div>
            <motion.div
                className="loading-text text-white text-2xl mt-8"
                animate={{
                    opacity: [0, 1, 0],
                }}
                transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    times: [0, 0.5, 1],
                    repeat: Infinity,
                }}
            >
            </motion.div>
        </div>
    );
};

export default LanguageLoadingAnimation;