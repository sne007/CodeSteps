import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaApple, FaFacebookF, FaGoogle, FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from '../components/context/AuthContext';

const Logo = () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const BackgroundPattern = ({ mousePosition }) => {
    const symbols = [
        '{ }', '[ ]', '( )', ';', '//', '/*', '*/', '&&', '||', '===', '=>',
        'for', 'if', 'else', 'import',
        '+', '-', '*', '/', '%', '=', '!', '<', '>', '|', '&', '^', '~',
        'π', '∑', '∫', '∂', '√', '∞', 'θ', 'λ', 'μ', 'σ', 'Ω'
    ];

    const colorPalette = [
        'rgba(79, 70, 229, 0.4)',  // Indigo (original color)
        'rgba(236, 72, 153, 0.4)', // Pink
        'rgba(34, 211, 238, 0.4)', // Cyan
        'rgba(16, 185, 129, 0.4)', // Emerald
        'rgba(245, 158, 11, 0.4)', // Amber
    ];

    const generateSymbols = useMemo(() => {
        const result = [];
        const rows = 15;
        const cols = 25;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const symbol = symbols[Math.floor(Math.random() * symbols.length)];
                const fontSize = Math.random() * 16 + 14; // Random size between 14 and 30
                const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                result.push(
                    <text
                        key={`${x}-${y}`}
                        x={`${(x / cols) * 100}%`}
                        y={`${(y / rows) * 100}%`}
                        fontSize={fontSize}
                        fill={color}
                        fontFamily="monospace"
                        textAnchor="middle"
                        dominantBaseline="central"
                    >
                        {symbol}
                    </text>
                );
            }
        }
        return result;
    }, []);

    return (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <motion.g
                initial={{ x: 0, y: 0 }}
                animate={{
                    x: mousePosition.x * 20,
                    y: mousePosition.y * 20,
                }}
                transition={{ type: "tween", duration: 0 }}
            >
                {generateSymbols}
            </motion.g>
        </svg>
    );
};



const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'hello' && password === 'password') {
            login('dummy-token'); // In a real app, you'd get this token from your backend
            navigate('/');
        } else {
            setError('Invalid username or password');
        }
    };

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (containerRef.current) {
                const { left, top, width, height } = containerRef.current.getBoundingClientRect();
                const x = (event.clientX - left - width / 2) / width;
                const y = (event.clientY - top - height / 2) / height;
                setMousePosition({ x, y });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div 
            className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
            ref={containerRef}
        >
            <BackgroundPattern mousePosition={mousePosition} />
            <motion.div
                className="max-w-md w-full space-y-8 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg p-10 rounded-xl shadow-xl relative z-10"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center">
                    <Logo />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to CodeMaster</h2>
                    <p className="mt-2 text-sm text-gray-600">Unlock your coding potential</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <label htmlFor="username" className="sr-only">Username</label>
                            <FaUser className="absolute top-3 left-3 text-gray-400" />
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="relative"
                        >
                            <label htmlFor="password" className="sr-only">Password</label>
                            <FaLock className="absolute top-3 left-3 text-gray-400" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </motion.div>
                    </div>

                    {error && (
                        <motion.div
                            className="text-red-600 text-sm text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <div>
                        <motion.button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Sign in
                        </motion.button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <FaGoogle className="text-red-500" />
                            </a>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <FaFacebookF className="text-blue-600" />
                            </a>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <FaApple />
                            </a>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;