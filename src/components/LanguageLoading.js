import React from 'react';
import { motion } from 'framer-motion';
import { FaPython, FaJava, FaJs, FaCode } from 'react-icons/fa';

const LanguageLoadingAnimation = ({ languageId }) => {
    const getLanguageIcon = () => {
        switch (languageId.toLowerCase()) {
            case 'python':
                return <FaPython className="text-cyan-400 text-6xl" />;
            case 'java':
                return <FaJava className="text-cyan-400 text-6xl" />;
            case 'javascript':
                return <FaJs className="text-cyan-400 text-6xl" />;
            default:
                return <FaCode className="text-cyan-400 text-6xl" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
            {/* Background elements to match main theme */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-600 opacity-20 blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-teal-600 opacity-10 blur-3xl"></div>

            {/* Grid pattern overlay to match main theme */}
            <div className="absolute inset-0 z-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 60H0V0h60v60zm-20 0H0V0h40v40zm-20 0H0V0h20v20z' fill='%2306B6D4' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}
            ></div>

            {/* Loading animation */}
            <div className="relative z-10">
                <motion.div
                    className="bg-slate-800 bg-opacity-50 p-8 rounded-2xl border border-cyan-500/30 shadow-xl backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="flex justify-center mb-6"
                        animate={{
                            rotateY: [0, 360],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 2,
                            ease: "easeInOut",
                            times: [0, 0.5, 1],
                            repeat: Infinity,
                        }}
                    >
                        {getLanguageIcon()}
                    </motion.div>

                    <motion.div
                        className="bg-slate-700/50 h-2 w-64 rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan-400 to-teal-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                                duration: 1.5,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.div>

                    <motion.p
                        className="text-center text-cyan-300 mt-4 text-sm font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                            duration: 1.5,
                            ease: "easeInOut",
                            times: [0, 0.5, 1],
                            repeat: Infinity,
                        }}
                    >
                        Preparing your coding adventure...
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
};

export default LanguageLoadingAnimation;