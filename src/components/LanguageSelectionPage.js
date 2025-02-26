import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import anime from 'animejs/lib/anime.es.js';
import { FaPython, FaJava, FaJs, FaCode, FaTrophy, FaStar, FaUserAstronaut, FaRocket } from 'react-icons/fa';
import { RiSwordFill, RiShieldFill, RiMagicFill } from 'react-icons/ri';
import { GiCrystalBall, GiFireGem, GiSpellBook, GiCursedStar } from 'react-icons/gi';

// Floating particles component
const ParticleBackground = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    const particles = [];
    const colors = ['#10B981', '#06B6D4', '#3B82F6', '#F59E0B', '#EC4899'];
    const container = particlesRef.current;
    const containerRect = container.getBoundingClientRect();

    // Create particles
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.width = `${Math.random() * 8 + 4}px`;
      particle.style.height = particle.style.width;
      particle.style.opacity = Math.random() * 0.6 + 0.2;

      // Random starting position
      particle.style.left = `${Math.random() * containerRect.width}px`;
      particle.style.top = `${Math.random() * containerRect.height}px`;

      container.appendChild(particle);
      particles.push(particle);

      // Animate each particle
      anime({
        targets: particle,
        translateX: () => anime.random(-100, 100),
        translateY: () => anime.random(-100, 100),
        opacity: [
          { value: Math.random() * 0.8, duration: 1000 },
          { value: 0.1, duration: 1000 }
        ],
        scale: [
          { value: Math.random() + 0.5, duration: 1000 },
          { value: 0, duration: 1000 }
        ],
        rotate: () => anime.random(-360, 360),
        duration: () => anime.random(6000, 15000),
        easing: 'easeInOutQuad',
        loop: true,
        delay: anime.random(0, 5000)
      });
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);

  return (
    <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0"></div>
  );
};

// Animated logo component
const AnimatedLogo = () => {
  const logoRef = useRef(null);

  useEffect(() => {
    const animation = anime({
      targets: logoRef.current.querySelectorAll('path'),
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutCubic',
      duration: 3000,
      delay: (el, i) => i * 250,
      direction: 'alternate',
      loop: true
    });

    return () => animation.pause();
  }, []);

  return (
    <svg ref={logoRef} className="w-20 h-20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="#06B6D4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke="#06B6D4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke="#06B6D4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Animated achievement badge
const AchievementBadge = ({ icon: Icon, title, value, max }) => {
  const progressRef = useRef(null);

  useEffect(() => {
    anime({
      targets: progressRef.current,
      width: `${(value / max) * 100}%`,
      easing: 'easeInOutQuad',
      duration: 1500
    });
  }, [value, max]);

  return (
    <motion.div
      className="bg-slate-800 bg-opacity-60 backdrop-blur-sm p-3 rounded-xl border border-teal-500"
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <div className="flex items-center mb-2">
        <div className="bg-gradient-to-br from-cyan-400 to-teal-500 p-2 rounded-lg mr-3">
          <Icon className="text-slate-900 text-xl" />
        </div>
        <div>
          <h3 className="text-white font-bold">{title}</h3>
          <p className="text-xs text-cyan-300">{value} / {max}</p>
        </div>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div ref={progressRef} className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 w-0"></div>
      </div>
    </motion.div>
  );
};

// Game card for language selection
const GameCard = ({ id, name, icon: Icon, description, level, onClick }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // Pulse animation for the card glow
    anime({
      targets: glowRef.current,
      opacity: [0.3, 0.7, 0.3],
      scale: [1, 1.05, 1],
      easing: 'easeInOutSine',
      duration: 5000,
      loop: true
    });
  }, []);

  // Different gem icons for each language
  const gems = {
    python: <GiFireGem className="absolute top-4 right-4 text-2xl text-cyan-300" />,
    java: <GiCrystalBall className="absolute top-4 right-4 text-2xl text-blue-300" />,
    javascript: <GiSpellBook className="absolute top-4 right-4 text-2xl text-emerald-300" />,
    cpp: <GiCursedStar className="absolute top-4 right-4 text-2xl text-purple-300" />
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-teal-600 group"
      onClick={() => onClick(id)}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
    >
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-300"
      ></div>

      {/* Particles on hover (appears on hover) */}
      <AnimatePresence>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan-400 hidden group-hover:block"
            initial={{ opacity: 0, x: '50%', y: '50%' }}
            animate={{
              opacity: [0, 1, 0],
              x: `${50 + (Math.random() * 100 - 50)}%`,
              y: `${50 + (Math.random() * 100 - 50)}%`,
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 0.5
            }}
          />
        ))}
      </AnimatePresence>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMC41IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIi8+PC9zdmc+')] opacity-20"></div>

      {/* Top banner */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400"></div>

      {/* Gem icon */}
      {gems[id]}

      {/* Level badge */}
      <div className="absolute top-4 left-4 bg-cyan-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-full">
        Lvl {level}
      </div>

      <div className="p-8 pt-12 flex flex-col items-center relative z-10">
        <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 border-4 border-cyan-400 mb-6 shadow-lg overflow-hidden group-hover:border-cyan-300 transition-colors duration-300">
          <Icon className="text-6xl text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-white">{name}</h2>
        <p className="text-slate-300 text-center mb-6">{description}</p>

        {/* Skill bars */}
        <div className="w-full space-y-3 mb-6">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-xs text-cyan-300">Power</span>
              <span className="text-xs text-cyan-300">85%</span>
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 w-[85%]"></div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-xs text-cyan-300">Speed</span>
              <span className="text-xs text-cyan-300">70%</span>
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 w-[70%]"></div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-xs text-cyan-300">Difficulty</span>
              <span className="text-xs text-cyan-300">60%</span>
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 w-[60%]"></div>
            </div>
          </div>
        </div>

        <motion.button
          className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold shadow-lg relative overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">Select Quest</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Animated leaderboard player component
const LeaderboardPlayer = ({ player, rank }) => {
  return (
    <motion.div
      className="bg-slate-800 backdrop-blur-md rounded-xl p-4 border border-slate-700 shadow-xl overflow-hidden relative"
      whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(8, 145, 178, 0.5)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: rank * 0.1 }}
    >
      <div className="absolute -right-4 -top-4 bg-gradient-to-br from-cyan-400 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center transform rotate-12 opacity-80 z-0">
        <span className="font-bold text-lg text-slate-900">{rank + 1}</span>
      </div>

      <div className="flex items-center z-10 relative">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-3xl mr-4 border-2 border-cyan-400">
          {player.avatar}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-white text-lg">{player.name}</h4>
            <div className="flex items-center">
              <FaStar className="text-cyan-400 mr-1" />
              <span className="text-cyan-300 font-bold">{player.score.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-2">
            <div className="flex space-x-3">
              {player.badges.map((badge, i) => (
                <div
                  key={i}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs"
                  title={badge.name}
                >
                  {badge.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-700">
        <div className="flex justify-between items-center text-xs">
          <div className="text-slate-300">Last Quest: {player.lastQuest}</div>
          <div className={`px-2 py-1 rounded ${player.streak > 5 ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>
            {player.streak} day streak 🔥
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Daily quest component
const DailyQuest = ({ quest, onClaim, claimed }) => {
  return (
    <motion.div
      className="bg-slate-800 bg-opacity-60 rounded-xl p-4 border border-slate-700 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgxMHYxMEgwek0xMCAxMGgxMHYxMEgxMHoiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')]"></div>
      </div>

      <div className="flex items-start mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-lg flex items-center justify-center text-slate-900 mr-4 flex-shrink-0">
          {quest.icon}
        </div>
        <div className="flex-grow">
          <h4 className="text-white font-bold">{quest.title}</h4>
          <p className="text-slate-300 text-sm">{quest.description}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <FaStar className="text-cyan-400 mr-1" />
          <span className="text-cyan-300 font-bold">+{quest.reward}</span>
        </div>

        {claimed ? (
          <div className="bg-green-500 bg-opacity-20 text-green-300 px-3 py-1 rounded-lg text-sm flex items-center">
            <FaStar className="mr-1" /> Claimed
          </div>
        ) : (
          <motion.button
            className="bg-cyan-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClaim(quest)}
          >
            Claim
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Main page component
const LanguageSelectionPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [starCount, setStarCount] = useState(250);
  const [claimedQuests, setClaimedQuests] = useState([]);
  const headerRef = useRef(null);

  const languages = [
    {
      id: 'python',
      name: 'Python',
      icon: FaPython,
      level: 8,
      description: 'Master Python and conquer the coding world with this powerful language!'
    },
    {
      id: 'java',
      name: 'Java',
      icon: FaJava,
      level: 7,
      description: 'Build powerful applications and master object-oriented programming!'
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      icon: FaJs,
      level: 6,
      description: 'Create interactive web experiences and dominate front-end development!'
    },
    {
      id: 'cpp',
      name: 'C++',
      icon: FaCode,
      level: 9,
      description: 'Dive into high performance computing and low-level programming mastery!'
    },
  ];

  const achievements = [
    { icon: FaTrophy, title: 'Quests Completed', value: 24, max: 100 },
    { icon: FaStar, title: 'Stars Collected', value: 250, max: 1000 },
    { icon: RiSwordFill, title: 'Challenges Won', value: 7, max: 50 },
  ];

  const players = [
    {
      name: 'Dragon Coder',
      score: 15400,
      avatar: '🐉',
      badges: [
        { name: 'Python Master', icon: <FaPython /> },
        { name: 'Daily Streak 30', icon: '30' },
        { name: 'Problem Solver', icon: <RiMagicFill /> }
      ],
      lastQuest: 'Binary Tree Challenge',
      streak: 30
    },
    {
      name: 'Pixel Wizard',
      score: 14500,
      avatar: '🧙',
      badges: [
        { name: 'JavaScript Guru', icon: <FaJs /> },
        { name: 'Challenge Winner', icon: <RiSwordFill /> }
      ],
      lastQuest: 'React Components',
      streak: 12
    },
    {
      name: 'Binary Knight',
      score: 14200,
      avatar: '🐴',
      badges: [
        { name: 'C++ Expert', icon: <FaCode /> },
        { name: 'Speed Coder', icon: <FaRocket /> }
      ],
      lastQuest: 'Algorithm Race',
      streak: 7
    },
  ];

  const dailyQuests = [
    {
      id: 1,
      icon: <FaJs className="text-xl" />,
      title: 'JavaScript Basics',
      description: 'Complete the intro to JavaScript variables lesson',
      reward: 15
    },
    {
      id: 2,
      icon: <FaPython className="text-xl" />,
      title: 'Python Challenge',
      description: 'Solve today\'s Python algorithm challenge',
      reward: 25
    },
    {
      id: 3,
      icon: <FaUserAstronaut className="text-xl" />,
      title: 'Update Profile',
      description: 'Complete your coding profile with skills and bio',
      reward: 10
    }
  ];

  const handleLanguageSelect = (languageId) => {
    // Create a burst of confetti when selecting a language
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06B6D4', '#10B981', '#3B82F6']
    });

    // Add some stars
    setStarCount(prev => prev + 5);

    // Navigate to the selected language
    navigate(`/curriculum/${languageId}`);
  };

  const handleLoginToggle = () => {
    setIsLoggedIn(!isLoggedIn);

    if (!isLoggedIn) {
      // Login animation
      anime({
        targets: 'header',
        translateY: [-20, 0],
        opacity: [0, 1],
        easing: 'easeOutElastic(1, .8)',
        duration: 800
      });

      // Reward animation
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.1, x: 0.9 },
          colors: ['#06B6D4', '#10B981', '#3B82F6']
        });

        setStarCount(prev => prev + 25);
      }, 500);
    }
  };

  const handleQuestClaim = (quest) => {
    setClaimedQuests(prev => [...prev, quest.id]);
    setStarCount(prev => prev + quest.reward);

    // Create confetti at the button location
    const buttonRect = document.getElementById(`quest-${quest.id}`).getBoundingClientRect();
    confetti({
      particleCount: 50,
      spread: 50,
      origin: {
        y: buttonRect.bottom / window.innerHeight,
        x: buttonRect.right / window.innerWidth
      },
      colors: ['#06B6D4', '#10B981', '#3B82F6']
    });
  };

  useEffect(() => {
    // Page entrance animation
    anime({
      targets: 'main > *',
      translateY: [50, 0],
      opacity: [0, 1],
      easing: 'easeOutExpo',
      duration: 1500,
      delay: anime.stagger(200, {start: 300})
    });

    // Floating star animation
    const starAnimation = anime({
      targets: '.floating-star',
      translateY: ['-10px', '10px'],
      duration: 2000,
      easing: 'easeInOutQuad',
      direction: 'alternate',
      loop: true
    });

    // Header glow effect
    anime({
      targets: headerRef.current,
      boxShadow: [
        '0 0 5px rgba(6, 182, 212, 0.3)',
        '0 0 20px rgba(6, 182, 212, 0.5)',
        '0 0 5px rgba(6, 182, 212, 0.3)'
      ],
      duration: 3000,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true
    });

    // Random confetti burst
    const confettiInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        confetti({
          particleCount: 20,
          angle: Math.random() * 360,
          spread: 70,
          origin: { x: Math.random(), y: Math.random() },
          colors: ['#06B6D4', '#10B981', '#3B82F6', '#F59E0B']
        });
      }
    }, 8000);

    return () => {
      clearInterval(confettiInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Particle background */}
      <ParticleBackground />

      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-600 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-teal-600 opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent opacity-80"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNjAgNjBIMFYwaDYwdjYwem0tMjAgMEgwVjBoNDB2NDB6bS0yMCAwSDBWMGgyMHYyMHoiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMikiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] opacity-30"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header ref={headerRef} className="flex justify-between items-center py-4 px-6 rounded-2xl backdrop-blur-md bg-slate-800 bg-opacity-30 border border-slate-600 border-opacity-50 shadow-lg mb-12">
          <div className="flex items-center">
            <AnimatedLogo />
            <div className="ml-4">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
                CodeQuest
              </h1>
              <p className="text-slate-300 text-sm">Your coding adventure awaits</p>
            </div>
          </div>

          <nav className="flex items-center space-x-6">
            {/* Level progress */}
            <div className="hidden md:block">
              <div className="flex items-center mb-1">
                <span className="text-cyan-400 text-xs font-bold mr-2">LVL 5</span>
                <div className="h-2 w-36 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 w-3/4"></div>
                </div>
                <span className="text-cyan-400 text-xs font-bold ml-2">LVL 6</span>
              </div>
              <p className="text-slate-300 text-xs text-center">750 / 1000 XP</p>
            </div>

            {/* Star counter with animation */}
            <motion.div
              className="flex items-center bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-4 py-2 rounded-xl shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3, times: [0, 0.5, 1] }}
              key={starCount}
            >
              <FaStar className="mr-2 text-xl" />
              <span className="font-bold text-lg">{starCount}</span>
            </motion.div>

            {/* Login button */}
            <motion.button
              onClick={handleLoginToggle}
              className={`${isLoggedIn
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white'}
                font-bold py-2.5 px-6 rounded-xl shadow-lg flex items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoggedIn ? (
                <>
                  <FaUserAstronaut className="mr-2" />
                  <span>Logout</span>
                </>
              ) : (
                <>
                  <FaRocket className="mr-2" />
                  <span>Login</span>
                </>
              )}
            </motion.button>
          </nav>
        </header>

        <main className="space-y-20">
          {/* Hero section */}
          <section className="text-center relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
                Choose Your Coding <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">Adventure!</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                Embark on an epic journey to become a coding legend. Pick your language and start your quest to unlock powerful skills!
              </p>

              {/* Floating stars */}
              <div className="floating-star absolute -top-6 left-1/4 text-3xl text-cyan-400">✨</div>
              <div className="floating-star absolute top-6 right-1/4 text-2xl text-teal-300 transform rotate-12">⭐</div>
              <div className="floating-star absolute -bottom-10 left-1/3 text-4xl text-cyan-400 transform -rotate-12">✨</div>
            </motion.div>

            {/* Achievement banner */}
            <div className="mt-12 mb-8">
              <motion.div
                className="bg-slate-800 bg-opacity-50 backdrop-blur-md border border-slate-600 rounded-2xl p-4 md:p-6 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center">
                  <FaTrophy className="text-cyan-400 mr-2" />
                  Your Achievements
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {achievements.map((achievement, index) => (
                    <AchievementBadge key={index} {...achievement} />
                  ))}
                </div>

                <motion.div
                  className="mt-6 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <button className="bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium py-2 px-4 rounded-lg border border-slate-500">
                    View All Achievements
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Language selection */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {languages.map((language, index) => (
                <motion.div
                  key={language.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GameCard
                    {...language}
                    onClick={handleLanguageSelect}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Daily quests section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center mr-3">
                  <FaRocket className="text-xl text-slate-900" />
                </div>
                <h3 className="text-2xl font-bold text-white">Daily Quests</h3>
              </div>

              <div className="space-y-4">
                {dailyQuests.map((quest) => (
                  <div key={quest.id} id={`quest-${quest.id}`}>
                    <DailyQuest
                      quest={quest}
                      onClaim={handleQuestClaim}
                      claimed={claimedQuests.includes(quest.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center mr-3">
                  <FaTrophy className="text-xl text-slate-900" />
                </div>
                <h3 className="text-2xl font-bold text-white">Leaderboard</h3>
              </div>

              <div className="space-y-4">
                {players.map((player, index) => (
                  <LeaderboardPlayer key={index} player={player} rank={index} />
                ))}

                <motion.button
                  className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl border border-slate-600 mt-4 flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="mr-2">View Full Leaderboard</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-20 text-center text-slate-300 relative z-10 border-t border-slate-800 pt-8">
          <p className="flex items-center justify-center">
            <FaStar className="text-cyan-400 mr-2" />
            Earn stars with every completed challenge!
          </p>
          <p className="mt-4">&copy; 2024 CodeQuest. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default LanguageSelectionPage;