import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';

const Logo = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Header = ({ score, isLoggedIn, handleLoginToggle }) => {
    return (
        <header className="flex justify-between items-center mb-8">
            <Link to="/" className="flex items-center">
                <Logo />
                <h1 className="ml-2 text-2xl font-bold text-indigo-900">CodeMaster</h1>
            </Link>
            <div className="flex items-center">
                <div className="mr-4 flex items-center bg-yellow-400 text-yellow-800 px-3 py-1 rounded-full">
                    <StarIcon className="h-5 w-5 mr-1" />
                    <span className="font-bold">{score}</span>
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
            </div>
        </header>
    );
};

export default Header;