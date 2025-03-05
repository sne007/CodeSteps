import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import anime from 'animejs/lib/anime.es.js';
import { FaPython, FaJava, FaJs, FaCode, FaTrophy, FaStar, FaUserAstronaut, FaRocket, FaSkull, FaFire, FaScroll } from 'react-icons/fa';
import { RiSwordFill, RiShieldFill, RiMagicFill, RiSwordLine, RiFireFill } from 'react-icons/ri';
import { GiCrystalBall, GiFireGem, GiSpellBook, GiCursedStar, GiDragonHead, GiBurningEmbers, GiBoneKnife, 
  GiDeathSkull, GiDrippingBlade, GiCrossedSwords, GiPotionBall, GiAnvil, GiRuneSword, GiCastle, GiChainedHeart, 
  GiAxeSword, GiEvilMoon, GiIronMask, GiBloodySword, GiBurningBook, GiRollingDices, GiThornHelix } from 'react-icons/gi';
import { SiFirebase } from 'react-icons/si';
import { TbSwords } from 'react-icons/tb';

// Ash particles background
const AshParticles = () => {
  const particlesRef = useRef(null);
  
  useEffect(() => {
    const particles = [];
    const container = particlesRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Create falling ash particles
    for (let i = 0; i < 60; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full';
      
      // Varied ash colors
      const colors = ['#444', '#555', '#666', '#777', '#888', '#999', '#aaa'];
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Varied sizes for depth effect
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = particle.style.width;
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      
      // Random starting position
      particle.style.left = `${Math.random() * containerRect.width}px`;
      particle.style.top = `${Math.random() * containerRect.height}px`;
      
      container.appendChild(particle);
      particles.push(particle);
      
      // Animate each particle falling
      anime({
        targets: particle,
        translateX: () => anime.random(-150, 150),
        translateY: containerRect.height,
        opacity: [
          { value: Math.random() * 0.6, duration: 1000 },
          { value: 0, duration: 3000 }
        ],
        easing: 'easeOutQuad',
        duration: () => anime.random(10000, 20000),
        loop: true,
        delay: anime.random(0, 8000)
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

// Enhanced ember particles background - now mystic particles
const EmberBackground = () => {
  const embersRef = useRef(null);

  useEffect(() => {
    const embers = [];
    const colors = [
      '#F59E0B', '#D97706', '#B45309', '#FBBF24', '#FCD34D', 
      '#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F'
    ];
    const container = embersRef.current;
    const containerRect = container.getBoundingClientRect();

    // Create more varied ember particles
    for (let i = 0; i < 50; i++) {
      const ember = document.createElement('div');
      ember.className = 'absolute rounded-full';
      ember.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // More varied sizes for depth effect
      const size = Math.random() * 4 + 2;
      ember.style.width = `${size}px`;
      ember.style.height = ember.style.width;
      ember.style.opacity = Math.random() * 0.6 + 0.1;
      
      // Gaussian-like distribution around areas of interest
      const xPosition = Math.random();
      let yPosition;
      
      // Create ember hot spots by placing more embers at certain y positions
      const hotspot = Math.random();
      if (hotspot < 0.3) {
        // More embers near the top
        yPosition = Math.random() * 0.3;
      } else if (hotspot < 0.7) {
        // More embers in the middle
        yPosition = 0.3 + Math.random() * 0.4;
      } else {
        // More embers at the bottom
        yPosition = 0.7 + Math.random() * 0.3;
      }
      
      ember.style.left = `${xPosition * containerRect.width}px`;
      ember.style.top = `${yPosition * containerRect.height}px`;

      container.appendChild(ember);
      embers.push(ember);

      // Animate each ember with more complex behaviors
      anime({
        targets: ember,
        translateX: () => anime.random(-200, 200),
        translateY: () => anime.random(-400, -50),
        opacity: [
          { value: Math.random() * 0.8, duration: 1000 },
          { value: 0, duration: 2000 }
        ],
        scale: [
          { value: Math.random() * 2 + 0.5, duration: 1000 },
          { value: 0, duration: 2000 }
        ],
        duration: () => anime.random(3000, 8000),
        easing: 'easeOutExpo',
        loop: true,
        delay: anime.random(0, 5000)
      });
    }

    return () => {
      embers.forEach(p => p.remove());
    };
  }, []);

  return (
    <div ref={embersRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0"></div>
  );
};

// Improved AnimatedBonfire component with more subtle light effects - now mystic flame
const AnimatedBonfire = () => {
  const bonfireRef = useRef(null);
  const soulsRef = useRef(null);

  useEffect(() => {
    // Add null check to prevent error
    if (bonfireRef.current) {
      const flames = bonfireRef.current.querySelectorAll('.flame');
      
      // Create more organic flame animation
      anime({
        targets: flames,
        translateY: (el, i) => [-10 - i * 2, -18 - i * 3],
        translateX: (el, i) => [anime.random(-5, 5), anime.random(-5, 5)],
        scale: (el, i) => [1, 0.85 + i * 0.1],
        opacity: (el, i) => [0.7 - i * 0.1, 0.2 - i * 0.05],
        easing: 'easeInOutSine',
        duration: 1200,
        delay: (el, i) => i * 100,
        direction: 'alternate',
        loop: true
      });
    }
    
    // Add null check for soulsRef too
    if (soulsRef.current) {
      // Animate rising souls
      const souls = soulsRef.current.querySelectorAll('.soul');
      
      souls.forEach((soul, index) => {
        anime({
          targets: soul,
          translateY: [0, -60 - (index * 15)],
          translateX: anime.random(-15, 15),
          opacity: [0.6, 0],
          scale: [1, 0.4],
          easing: 'easeOutExpo',
          duration: 4000 + (index * 500),
          delay: index * 1000,
          loop: true
        });
      });
    }
    
    return () => {};
  }, []);

  return (
    <div className="relative w-20 h-24">
      {/* Improved bonfire base */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-gray-900 rounded-full border-t border-gray-700 z-10"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-8 flex justify-center">
        <div className="w-1 h-8 bg-gray-800 transform rotate-6"></div>
        <div className="w-1 h-10 bg-gray-800 transform -rotate-6"></div>
        <div className="w-1 h-7 bg-gray-800 transform rotate-12"></div>
        <div className="w-1 h-8 bg-gray-800 transform rotate-18"></div>
      </div>
      
      {/* Mystical flames */}
      <div ref={bonfireRef}>
        <div className="flame absolute bottom-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-amber-600 rounded-full filter blur-md z-0 opacity-50"></div>
        <div className="flame absolute bottom-5 left-1/2 transform -translate-x-1/2 w-8 h-12 bg-amber-500 rounded-full filter blur-md z-1 opacity-40"></div>
        <div className="flame absolute bottom-5 left-1/2 transform -translate-x-1/2 w-6 h-14 bg-yellow-500 rounded-full filter blur-md z-2 opacity-30"></div>
        <div className="flame absolute bottom-5 left-1/2 transform -translate-x-1/2 w-4 h-16 bg-yellow-300 rounded-full filter blur-sm z-3 opacity-20"></div>
      </div>
      
      {/* More subtle glow effect */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-amber-500 rounded-full opacity-15 filter blur-lg"></div>
      
      {/* Rising souls */}
      <div ref={soulsRef} className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
        <div className="soul absolute w-2 h-4 bg-yellow-200 rounded-full opacity-20 filter blur-sm left-0"></div>
        <div className="soul absolute w-1.5 h-3 bg-amber-100 rounded-full opacity-15 filter blur-sm left-2"></div>
        <div className="soul absolute w-2 h-3 bg-yellow-50 rounded-full opacity-20 filter blur-sm -left-2"></div>
        <div className="soul absolute w-1.5 h-3 bg-amber-100 rounded-full opacity-15 filter blur-sm left-1"></div>
      </div>
    </div>
  );
};

// Animated sword component
const AnimatedSword = () => {
  const swordRef = useRef(null);
  
  useEffect(() => {
    // Subtle hovering animation
    anime({
      targets: swordRef.current,
      translateY: [-5, 5],
      rotate: [-1, 1],
      easing: 'easeInOutQuad',
      duration: 3000,
      direction: 'alternate',
      loop: true
    });
    
    return () => {};
  }, []);
  
  return (
    <div ref={swordRef} className="relative w-10 h-40">
      {/* Sword handle */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-10 bg-gradient-to-b from-amber-900 to-yellow-800 rounded-sm"></div>
      
      {/* Sword guard */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gray-300 rounded-sm"></div>
      
      {/* Sword blade */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-2 h-28 bg-gradient-to-t from-gray-500 to-gray-300">
        {/* Blade tip */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-gradient-to-t from-gray-400 to-gray-300 rotate-45"></div>
      </div>
      
      {/* Glowing runes */}
      <div className="absolute bottom-30 left-1/2 transform -translate-x-1/2 h-2 w-2 bg-amber-500 rounded-full filter blur-sm animate-pulse"></div>
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 h-1.5 w-1.5 bg-yellow-400 rounded-full filter blur-sm animate-pulse" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 h-2 w-2 bg-amber-500 rounded-full filter blur-sm animate-pulse" style={{animationDelay: '1s'}}></div>
    </div>
  );
};

// Animated fog effect
const FogEffect = () => {
  const fogRef = useRef(null);
  
  useEffect(() => {
    const fogElements = fogRef.current.querySelectorAll('.fog');
    
    fogElements.forEach((fog, index) => {
      anime({
        targets: fog,
        translateX: () => ['-100%', '100%'],
        opacity: [0, 0.2, 0],
        easing: 'linear',
        duration: 15000 + (index * 5000),
        delay: index * 3000,
        loop: true
      });
    });
    
    return () => {};
  }, []);
  
  return (
    <div ref={fogRef} className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      <div className="fog absolute h-20 w-full bg-gray-900 filter blur-xl bottom-0 opacity-0"></div>
      <div className="fog absolute h-20 w-full bg-gray-800 filter blur-xl bottom-20 opacity-0"></div>
      <div className="fog absolute h-20 w-full bg-gray-900 filter blur-xl bottom-40 opacity-0"></div>
      <div className="fog absolute h-20 w-full bg-gray-800 filter blur-xl top-20 opacity-0"></div>
      <div className="fog absolute h-20 w-full bg-gray-900 filter blur-xl top-0 opacity-0"></div>
    </div>
  );
};

// Soul badge component with enhanced visuals
const SoulBadge = ({ icon: Icon, title, value, max }) => {
  const progressRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    anime({
      targets: progressRef.current,
      width: `${(value / max) * 100}%`,
      easing: 'easeInOutQuad',
      duration: 1500
    });
    
    // Add pulsing glow animation
    anime({
      targets: glowRef.current,
      opacity: [0.1, 0.4, 0.1],
      scale: [1, 1.02, 1],
      easing: 'easeInOutSine',
      duration: 4000,
      loop: true
    });
  }, [value, max]);

  return (
    <motion.div
      className="relative bg-gray-950 bg-opacity-90 p-4 rounded-lg border border-gray-800 shadow-xl overflow-hidden"
      whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(217, 119, 6, 0.3)" }}
    >
      {/* Ember glow effect */}
      <div
        ref={glowRef}
        className="absolute -inset-1 bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 rounded-lg blur-lg opacity-0"
      ></div>
      
      {/* Runic patterns background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwIDIwSDBWMGgyMHYyMHpNNSA1aDEwdjEwSDV6IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMikiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')]"></div>
      </div>
      
      <div className="flex items-center mb-3 relative z-10">
        <div className="bg-gradient-to-br from-amber-900 to-black p-2.5 rounded-lg mr-3 shadow-lg border border-amber-900">
          <Icon className="text-gray-300 text-xl" />
        </div>
        <div>
          <h3 className="text-gray-200 font-serif font-bold tracking-wide">{title}</h3>
          <p className="text-xs text-amber-400 font-mono font-bold">{value} / {max}</p>
        </div>
      </div>
      
      <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800 relative z-10">
        <div ref={progressRef} className="h-full bg-gradient-to-r from-amber-900 to-yellow-600 w-0 relative">
          {/* Animated fire particles along the progress bar */}
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="absolute top-0 h-full w-1 bg-amber-400 opacity-70 animate-pulse" 
              style={{ 
                left: `${(i + 1) * 30}%`,
                animationDelay: `${i * 0.3}s`,
                filter: 'blur(1px)'
              }} 
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced covenant card with consistent height
const CovenantCard = ({ id, name, icon: Icon, level, description, onClick }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const flameRef = useRef(null);

  useEffect(() => {
    // Enhanced pulsing animation for the card glow
    anime({
      targets: glowRef.current,
      opacity: [0.1, 0.3, 0.1],
      scale: [1, 1.02, 1],
      easing: 'easeInOutSine',
      duration: 5000,
      loop: true
    });
    
    // Flame animation
    if (flameRef.current) {
      anime({
        targets: flameRef.current.querySelectorAll('.flame-particle'),
        translateY: (el) => [-20 - Math.random() * 10, -30 - Math.random() * 20],
        translateX: (el) => [Math.random() * 10 - 5, Math.random() * 20 - 10],
        opacity: [0.8, 0],
        scale: [1, 0.4],
        easing: 'easeOutExpo',
        duration: () => 1000 + Math.random() * 1000,
        delay: (el, i) => i * 100,
        loop: true
      });
    }
  }, []);

  // Different gothic-themed icon for each covenant/language
  const covenantIcons = {
    python: <GiDragonHead className="absolute top-4 right-4 text-3xl text-amber-600 animate-pulse" />,
    java: <GiAxeSword className="absolute top-4 right-4 text-3xl text-yellow-700 animate-pulse" />,
    javascript: <GiBurningBook className="absolute top-4 right-4 text-3xl text-amber-600 animate-pulse" />,
    cpp: <GiDeathSkull className="absolute top-4 right-4 text-3xl text-gray-400 animate-pulse" />
  };
  
  // Covenant-specific attribute values
  const covenantAttributes = {
    python: { strength: 70, dexterity: 60, intelligence: 95 },
    java: { strength: 85, dexterity: 75, intelligence: 70 },
    javascript: { strength: 60, dexterity: 95, intelligence: 80 },
    cpp: { strength: 95, dexterity: 65, intelligence: 75 }
  };
  
  const attrs = covenantAttributes[id] || { strength: 70, dexterity: 70, intelligence: 70 };

  return (
    <motion.div
      ref={cardRef}
      id={`covenant-${id}`}
      className="relative overflow-hidden cursor-pointer bg-gradient-to-br from-gray-950 to-black rounded-lg shadow-2xl border border-gray-800 group h-full flex flex-col"
      onClick={() => onClick(id)}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.3 }
      }}
    >
      {/* Enhanced ember glow effect */}
      <div
        ref={glowRef}
        className="absolute -inset-1 bg-gradient-to-r from-amber-900 via-black to-amber-900 rounded-lg blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"
      ></div>

      {/* Enhanced embers on hover */}
      <AnimatePresence>
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-yellow-600 hidden group-hover:block"
            initial={{ opacity: 0, x: '50%', y: '50%' }}
            animate={{
              opacity: [0, 0.9, 0],
              x: `${50 + (Math.random() * 100 - 50)}%`,
              y: `${50 + (Math.random() * 100 - 50)}%`,
              scale: [0, 1.4, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.15,
              repeat: Infinity,
              repeatDelay: 0.3
            }}
          />
        ))}
      </AnimatePresence>

      {/* Enhanced runic background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwIDQwTDAgMjBMMjAgMEw0MCAyMEwyMCA0MHpNMTAgMjBMMjAgMTBMMzAgMjBMMjAgMzBMMTAgMjB6IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-20"></div>

      {/* Covenant icon */}
      {covenantIcons[id]}

      {/* Enhanced level badge */}
      <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-900 to-black text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-900 shadow-lg">
        Soul Level {level}
      </div>

      <div className="p-8 pt-16 flex flex-col items-center relative z-10 flex-grow">
        {/* Icon circle with flame effects */}
        <div className="relative w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black border-4 border-amber-900 mb-6 shadow-xl overflow-hidden group-hover:border-amber-600 transition-colors duration-500">
          <div ref={flameRef} className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i}
                className="flame-particle absolute bottom-0 w-2 h-4 rounded-full bg-yellow-500 left-1/2 transform -translate-x-1/2 opacity-0"
                style={{ filter: 'blur(1px)', left: `${Math.random() * 100}%` }}
              />
            ))}
          </div>
          <Icon className="text-6xl text-amber-500 group-hover:text-yellow-400 transition-colors duration-500 transform group-hover:scale-110 transition-transform" />
        </div>

        <h2 className="text-xl font-serif font-bold mb-2 text-gray-200 tracking-wider group-hover:text-amber-400 transition-colors duration-300 text-center">{name}</h2>
        
        {/* Fixed-height description container */}
        <div className="h-16 flex items-center">
          <p className="text-gray-500 text-center mb-6 font-serif italic text-sm line-clamp-2">{description}</p>
        </div>

        {/* Enhanced attribute bars */}
        <div className="w-full space-y-4 mb-6">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-xs text-amber-400 font-bold flex items-center">
                <RiSwordFill className="mr-1" /> STRENGTH
              </span>
              <span className="text-xs text-amber-400 font-mono">{attrs.strength}%</span>
            </div>
            <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <div className="h-full bg-gradient-to-r from-amber-900 to-yellow-600 relative" style={{ width: `${attrs.strength}%` }}>
                <div className="absolute right-0 top-0 h-full w-1 bg-amber-300 opacity-70 animate-pulse" style={{ filter: 'blur(1px)' }}></div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-xs text-amber-400 font-bold flex items-center">
                <GiThornHelix className="mr-1" /> DEXTERITY
              </span>
              <span className="text-xs text-amber-400 font-mono">{attrs.dexterity}%</span>
            </div>
            <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <div className="h-full bg-gradient-to-r from-amber-900 to-yellow-600 relative" style={{ width: `${attrs.dexterity}%` }}>
                <div className="absolute right-0 top-0 h-full w-1 bg-amber-300 opacity-70 animate-pulse" style={{ filter: 'blur(1px)' }}></div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-xs text-amber-400 font-bold flex items-center">
                <GiFireGem className="mr-1" /> INTELLIGENCE
              </span>
              <span className="text-xs text-amber-400 font-mono">{attrs.intelligence}%</span>
            </div>
            <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <div className="h-full bg-gradient-to-r from-amber-900 to-yellow-600 relative" style={{ width: `${attrs.intelligence}%` }}>
                <div className="absolute right-0 top-0 h-full w-1 bg-amber-300 opacity-70 animate-pulse" style={{ filter: 'blur(1px)' }}></div>
              </div>
            </div>
          </div>
        </div>

        <motion.button
          className="w-full py-3 px-6 rounded-lg bg-gradient-to-b from-amber-900 to-black text-gray-200 font-serif font-bold shadow-lg relative overflow-hidden border border-amber-900 mt-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 tracking-wide">JOIN COVENANT</span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-800 to-yellow-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          
          {/* Button particles */}
          <AnimatePresence>
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-2 bg-yellow-400 rounded-full hidden group-hover:block"
                initial={{ opacity: 0, bottom: 0, left: '50%' }}
                animate={{
                  opacity: [0, 0.8, 0],
                  bottom: [0, 40],
                  left: `${50 + (Math.random() * 40 - 20)}%`,
                  scale: [1, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
                style={{ filter: 'blur(1px)' }}
              />
            ))}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Enhanced hollowed player component for the leaderboard
const HollowedPlayer = ({ player, rank }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-950 to-black bg-opacity-90 rounded-lg p-4 border border-gray-800 shadow-xl overflow-hidden relative"
      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(217, 119, 6, 0.3)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: rank * 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Background runic pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMEwyMCAyME0yMCAwTDAgMjAiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')]"></div>
      </div>
      
      {/* Ranking crown or skull */}
      <div className="absolute -right-6 -top-6 bg-gradient-to-br from-amber-900 to-black w-20 h-20 rounded-full flex items-center justify-center transform rotate-12 opacity-90 z-0 border border-amber-900 shadow-2xl">
        <span className="font-bold text-xl text-gray-200 transform -rotate-12">
          {rank === 0 ? (
            <FaTrophy className="text-2xl text-amber-500" />
          ) : rank === 1 ? (
            <FaStar className="text-2xl text-gray-300" />
          ) : rank === 2 ? (
            <FaStar className="text-2xl text-amber-700" />
          ) : (
            <span className="font-serif text-amber-400">{rank + 1}</span>
          )}
        </span>
      </div>

      <div className="flex items-center z-10 relative">
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-3xl mr-4 border-2 border-amber-900 shadow-xl">
          {/* Subtle glow around avatar */}
          <div className={`absolute inset-0 rounded-full bg-amber-900 opacity-0 ${hovered ? 'animate-pulse opacity-20' : ''} transition-opacity duration-300`} style={{filter: 'blur(4px)'}}></div>
          <span className="relative z-10">{player.avatar}</span>
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <h4 className="font-serif font-bold text-gray-200 text-lg tracking-wide">{player.name}</h4>
            <div className="flex items-center bg-gradient-to-r from-gray-900 to-black py-1 px-2 rounded-md border border-gray-800">
              <GiBurningEmbers className="text-amber-500 mr-1" />
              <span className="text-amber-400 font-bold font-mono">{player.score.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-2">
            <div className="flex space-x-3">
              {player.badges.map((badge, i) => (
                <div
                  key={i}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-b from-amber-900 to-black text-gray-200 text-xs border border-amber-900 shadow-md"
                  title={badge.name}
                >
                  {badge.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-800">
        <div className="flex justify-between items-center text-xs">
          <div className="text-gray-500 font-serif">Last Trial: <span className="text-gray-400">{player.lastQuest}</span></div>
          <div className={`px-2.5 py-1.5 rounded-md ${player.streak > 5 ? 'bg-gradient-to-r from-amber-900 to-black text-amber-400 border border-amber-900' : 'bg-gray-900 text-gray-500 border border-gray-800'} font-mono`}>
            {player.streak} undying days <RiFireFill className="inline ml-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced bonfire challenge component
const BonfireChallenge = ({ quest, onClaim, claimed }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-950 to-black bg-opacity-90 rounded-lg p-5 border border-gray-800 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMTVMMTUgMEwzMCAxNUwxNSAzMFoiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wOCkiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')]"></div>
      </div>
      
      {/* Animated ember particles */}
      <AnimatePresence>
        {hovered && Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-yellow-500"
            initial={{ opacity: 0, bottom: "20%", left: "20%" }}
            animate={{
              opacity: [0, 0.8, 0],
              bottom: ["20%", "80%"],
              left: `${20 + (Math.random() * 60)}%`,
              scale: [1, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 1
            }}
            style={{ filter: 'blur(1px)' }}
          />
        ))}
      </AnimatePresence>

      <div className="flex items-start mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-900 to-black rounded-lg flex items-center justify-center text-gray-200 mr-4 flex-shrink-0 border border-amber-900 shadow-lg relative overflow-hidden">
          {/* Icon glow effect */}
          <div className={`absolute inset-0 bg-amber-600 opacity-0 ${hovered ? 'animate-pulse opacity-20' : ''} transition-opacity duration-300`} style={{filter: 'blur(8px)'}}></div>
          <div className="relative z-10 text-2xl">{quest.icon}</div>
        </div>
        
        <div className="flex-grow">
          <h4 className="text-gray-200 font-serif font-bold tracking-wide text-lg">{quest.title}</h4>
          <p className="text-gray-500 text-sm font-serif">{quest.description}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center bg-gradient-to-r from-gray-900 to-black py-1.5 px-3 rounded-md border border-gray-800">
          <GiBurningEmbers className="text-amber-500 mr-2" />
          <span className="text-amber-400 font-bold font-mono">+{quest.reward}</span>
        </div>

        {claimed ? (
          <div className="bg-green-900 bg-opacity-30 text-green-500 px-4 py-2 rounded-lg text-sm flex items-center border border-green-900">
            <GiBurningEmbers className="mr-2" /> KINDLED
          </div>
        ) : (
          <motion.button
            className="bg-gradient-to-r from-amber-900 to-black text-gray-200 px-5 py-2 rounded-lg text-sm font-serif font-bold tracking-wide border border-amber-900 shadow-lg relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClaim(quest.id, quest)}
          >
            <span className="relative z-10">KINDLE FLAME</span>
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-800 to-yellow-600 translate-y-full hover:translate-y-0 transition-transform duration-300"></div>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Replace confetti with more thematic ember burst effects
const createEmberBurst = (origin = { x: 0.5, y: 0.5 }, intensity = 1) => {
  const emberContainer = document.createElement('div');
  emberContainer.className = 'fixed inset-0 pointer-events-none z-50';
  document.body.appendChild(emberContainer);
  
  // Create ember particles
  const particleCount = Math.floor(70 * intensity);
  const particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    const ember = document.createElement('div');
    ember.className = 'absolute rounded-full';
    
    // Varied ember colors - deeper golds and ambers
    const colors = ['#F59E0B', '#D97706', '#B45309', '#FBBF24', '#FCD34D', '#F59E0B'];
    ember.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Varied sizes
    const size = Math.random() * 6 + 2;
    ember.style.width = `${size}px`;
    ember.style.height = `${size}px`;
    
    // Set initial position based on origin
    ember.style.left = `${origin.x * 100}%`;
    ember.style.top = `${origin.y * 100}%`;
    
    // Add glow effect
    ember.style.boxShadow = `0 0 ${size * 2}px ${ember.style.backgroundColor}`;
    ember.style.filter = 'blur(1px)';
    
    emberContainer.appendChild(ember);
    particles.push(ember);
    
    // Animate each ember with more realistic physics
    const angle = Math.random() * Math.PI * 2;
    const velocity = (Math.random() * 15 + 5) * intensity;
    const xVelocity = Math.cos(angle) * velocity;
    const yVelocity = Math.sin(angle) * velocity - 10; // Extra upward bias
    
    anime({
      targets: ember,
      translateX: `${xVelocity * 10}px`,
      translateY: `${yVelocity * 10}px`,
      opacity: [
        { value: 0.9, duration: 100 },
        { value: 0, duration: 900 }
      ],
      scale: [
        { value: 1.2, duration: 100 },
        { value: 0, duration: 900 }
      ],
      easing: 'easeOutExpo',
      duration: 1000,
      complete: () => {
        ember.remove();
      }
    });
  }
  
  // Self-cleanup after animation
  setTimeout(() => {
    emberContainer.remove();
  }, 2000);
};

// Enhanced soul rising effect
const createSoulRisingEffect = (origin = { x: 0.5, y: 0.5 }) => {
  const soulContainer = document.createElement('div');
  soulContainer.className = 'fixed inset-0 pointer-events-none z-50';
  document.body.appendChild(soulContainer);
  
  // Create ethereal soul particles
  for (let i = 0; i < 12; i++) {
    const soul = document.createElement('div');
    soul.className = 'absolute rounded-full';
    
    // Soul colors - ethereal yellows and golds
    const colors = ['rgba(255, 235, 160, 0.8)', 'rgba(245, 158, 11, 0.5)', 
                    'rgba(251, 191, 36, 0.6)', 'rgba(252, 211, 77, 0.7)'];
    soul.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Soul sizes
    const size = Math.random() * 5 + 3;
    soul.style.width = `${size}px`;
    soul.style.height = `${size * (1 + Math.random())}px`; // Slightly oval
    
    // Set initial position with small random offset
    const offset = 20;
    soul.style.left = `calc(${origin.x * 100}% + ${Math.random() * offset - offset/2}px)`;
    soul.style.top = `calc(${origin.y * 100}% + ${Math.random() * offset - offset/2}px)`;
    
    // Add glow effect
    soul.style.boxShadow = `0 0 ${size * 3}px ${soul.style.backgroundColor}`;
    soul.style.filter = 'blur(2px)';
    
    soulContainer.appendChild(soul);
    
    // Soul rising animation with gentle swaying
    anime({
      targets: soul,
      translateY: [0, -200 - (Math.random() * 100)],
      translateX: () => {
        const drift = Math.random() * 40 - 20;
        return [`${drift/3}px`, `${drift}px`];
      },
      opacity: [
        { value: 0.8, duration: 200 },
        { value: 0, duration: 1800 }
      ],
      scale: [
        { value: 1, duration: 200 },
        { value: 0.3, duration: 1800 }
      ],
      easing: 'easeOutCubic',
      duration: 2000,
      delay: i * 50,
      complete: () => {
        soul.remove();
      }
    });
  }
  
  // Self-cleanup
  setTimeout(() => {
    soulContainer.remove();
  }, 3000);
};

// Rune circle activation effect
const createRunicEffect = (targetElement) => {
  const rect = targetElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const runeContainer = document.createElement('div');
  runeContainer.className = 'fixed inset-0 pointer-events-none z-40';
  document.body.appendChild(runeContainer);
  
  // Create magic circle
  const circleSize = Math.max(rect.width, rect.height) * 1.5;
  const runeCircle = document.createElement('div');
  runeCircle.className = 'absolute rounded-full border-2 border-amber-700';
  runeCircle.style.width = `${circleSize}px`;
  runeCircle.style.height = `${circleSize}px`;
  runeCircle.style.left = `${centerX - circleSize/2}px`;
  runeCircle.style.top = `${centerY - circleSize/2}px`;
  runeCircle.style.borderColor = 'rgba(180, 83, 9, 0.8)';
  runeCircle.style.boxShadow = '0 0 15px rgba(180, 83, 9, 0.5)';
  runeCircle.style.opacity = '0';
  
  runeContainer.appendChild(runeCircle);
  
  // Create small rune marks around the circle
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const runeX = centerX + Math.cos(angle) * (circleSize/2);
    const runeY = centerY + Math.sin(angle) * (circleSize/2);
    
    const rune = document.createElement('div');
    rune.className = 'absolute';
    rune.style.width = '10px';
    rune.style.height = '10px';
    rune.style.left = `${runeX - 5}px`;
    rune.style.top = `${runeY - 5}px`;
    rune.style.backgroundColor = 'rgba(217, 119, 6, 0.9)';
    rune.style.boxShadow = '0 0 8px rgba(217, 119, 6, 0.8)';
    rune.style.borderRadius = Math.random() > 0.5 ? '2px' : '50%';
    rune.style.opacity = '0';
    rune.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    runeContainer.appendChild(rune);
    
    // Animate runes individually
    anime({
      targets: rune,
      opacity: [0, 1, 0],
      scale: [0.5, 1.2, 0.8, 0],
      boxShadow: [
        '0 0 8px rgba(217, 119, 6, 0.8)',
        '0 0 15px rgba(217, 119, 6, 1)',
        '0 0 5px rgba(217, 119, 6, 0.3)'
      ],
      easing: 'easeOutSine',
      duration: 2000,
      delay: 200 + i * 100
    });
  }
  
  // Animate the circle
  anime({
    targets: runeCircle,
    opacity: [0, 0.8, 0],
    scale: [0.8, 1.2, 1.5],
    borderWidth: ['2px', '1px', '0px'],
    easing: 'easeOutSine',
    duration: 2000,
    complete: () => {
      setTimeout(() => {
        runeContainer.remove();
      }, 500);
    }
  });
};

// Main page component with enhanced gothic Dark Souls theme
const LanguageSelectionPage = () => {
  const navigate = useNavigate();
  const [isEmbered, setIsEmbered] = useState(false);
  const [soulCount, setSoulCount] = useState(2500);
  const [claimedChallenges, setClaimedChallenges] = useState([]);
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const flameRef = useRef(null);

  const covenants = [
    {
      id: 'python',
      name: 'Sunlight Devotees',
      icon: FaPython,
      level: 8,
      description: 'Brilliant covenant that harnesses ancient wisdom to forge elegant solutions. Praise the Snake!'
    },
    {
      id: 'java',
      name: 'Abyss Watchers',
      icon: FaJava,
      level: 7,
      description: 'Ancient structured magical code that empowers vast applications with disciplined incantations.'
    },
    {
      id: 'javascript',
      name: 'Lords of Chaos',
      icon: FaJs,
      level: 6,
      description: 'Chaotic covenant with unpredictable wild magic. Creates powerful illusions in the browser realm.'
    },
    {
      id: 'cpp',
      name: 'Blades of Memory',
      icon: FaCode,
      level: 9,
      description: 'Masters of the arcane machine arts. Their spells run closest to the forgotten memory language.'
    },
  ];

  const achievements = [
    { icon: FaSkull, title: 'Bosses Defeated', value: 24, max: 100 },
    { icon: GiBurningEmbers, title: 'Souls Harvested', value: 2500, max: 10000 },
    { icon: RiSwordLine, title: 'Invasions Won', value: 7, max: 50 },
  ];

  const players = [
    {
      name: 'Ashen One',
      score: 15400,
      avatar: '🔥',
      badges: [
        { name: 'Python Master', icon: <GiDragonHead /> },
        { name: 'Undying Streak', icon: '30' },
        { name: 'Problem Solver', icon: <RiMagicFill /> }
      ],
      lastQuest: 'Binary Tree Abyss',
      streak: 30
    },
    {
      name: 'Solaire',
      score: 14500,
      avatar: '☀️',
      badges: [
        { name: 'JavaScript Guru', icon: <FaJs /> },
        { name: 'Firekeeper', icon: <RiSwordFill /> }
      ],
      lastQuest: 'React Lothric',
      streak: 12
    },
    {
      name: 'Siegward',
      score: 14200,
      avatar: '🍺',
      badges: [
        { name: 'C++ Expert', icon: <FaCode /> },
        { name: 'Longfinger', icon: <FaFire /> }
      ],
      lastQuest: 'Irithyll Algorithm',
      streak: 7
    },
    {
      name: 'Firekeeper',
      score: 13800,
      avatar: '👁️',
      badges: [
        { name: 'Data Pyromancer', icon: <GiFireGem /> },
        { name: 'Compiler Smith', icon: <GiAnvil /> }
      ],
      lastQuest: 'Recursive Descent',
      streak: 5
    },
  ];

  const dailyChallenges = [
    {
      id: 1,
      icon: <FaJs className="text-xl" />,
      title: 'JavaScript Scrolls',
      description: 'Decipher the ancient scrolls of the closure abyss and recursive descent',
      reward: 150
    },
    {
      id: 2,
      icon: <FaPython className="text-xl" />,
      title: 'Python\'s Deep Abyss',
      description: 'Traverse the abyss of list comprehension without going hollow',
      reward: 250
    },
    {
      id: 3,
      icon: <GiRollingDices className="text-xl" />,
      title: 'Embers of Algorithms',
      description: 'Kindle the flame with the souls of sorted data structures',
      reward: 100
    }
  ];

  const handleCovenantSelect = (covenantId) => {
    // Replace confetti with ember burst and runic effect
    const covenantElement = document.getElementById(`covenant-${covenantId}`);
    if (covenantElement) {
      createRunicEffect(covenantElement);
      
      const rect = covenantElement.getBoundingClientRect();
      const centerX = (rect.left + rect.right) / 2 / window.innerWidth;
      const centerY = (rect.top + rect.bottom) / 2 / window.innerHeight;
      
      createEmberBurst({ x: centerX, y: centerY }, 1.2);
      
      // Add soul effect after a short delay
      setTimeout(() => {
        createSoulRisingEffect({ x: centerX, y: centerY });
      }, 300);
    }

    // Add some souls with dramatic effect
    setTimeout(() => {
      setSoulCount(prev => prev + 500);
    }, 600);

    // Navigate to loading screen first instead of directly to covenant
    // This will give time for animations to complete and show transition
    setTimeout(() => {
      navigate(`/loading/${covenantId}`);
    }, 800); // Slight delay for visual effects to be appreciated
  };

  const handleEmberToggle = () => {
    setIsEmbered(!isEmbered);

    if (!isEmbered) {
      // Login animation
      anime({
        targets: 'header',
        translateY: [-20, 0],
        opacity: [0, 1],
        easing: 'easeOutElastic(1, .8)',
        duration: 800
      });

      // Replace confetti with soul rising effect at top right
      setTimeout(() => {
        createSoulRisingEffect({ x: 0.9, y: 0.1 });
        createEmberBurst({ x: 0.9, y: 0.1 }, 0.7);
        
        setSoulCount(prev => prev + 250);
      }, 500);
    }
  };

  const handleChallengeKindle = (questId, quest) => {
    setClaimedChallenges(prev => [...prev, questId]);
    
    // Get button position for effect origin
    const questElement = document.getElementById(`quest-${questId}`);
    if (questElement) {
      const rect = questElement.getBoundingClientRect();
      const buttonX = rect.right / window.innerWidth;
      const buttonY = rect.bottom / window.innerHeight;
      
      // Create ember burst effect
      createEmberBurst({ x: buttonX, y: buttonY }, 0.8);
    }
    
    // Dramatic soul increase effect
    setTimeout(() => {
      setSoulCount(prev => prev + quest.reward);
    }, 300);
  };
  
  useEffect(() => {
    // Enhanced page entrance animation
    anime({
      targets: 'main > *',
      translateY: [80, 0],
      opacity: [0, 1],
      easing: 'easeOutExpo',
      duration: 1800,
      delay: anime.stagger(250, {start: 400})
    });

    // Title effects animation
    anime({
      targets: titleRef.current,
      textShadow: [
        '0 0 5px rgba(217, 119, 6, 0.3)',
        '0 0 25px rgba(217, 119, 6, 0.5)',
        '0 0 5px rgba(217, 119, 6, 0.3)'
      ],
      duration: 4000,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true
    });
    
    // Flame animation if exists
    if (flameRef.current) {
      anime({
        targets: flameRef.current.querySelectorAll('.flame-particle'),
        translateY: -20,
        opacity: [1, 0],
        scale: [1, 0.3],
        easing: 'easeOutExpo',
        duration: 1500,
        delay: anime.stagger(100),
        loop: true
      });
    }

    // Header glow effect
    anime({
      targets: headerRef.current,
      boxShadow: [
        '0 0 10px rgba(217, 119, 6, 0.3)',
        '0 0 30px rgba(217, 119, 6, 0.5)',
        '0 0 10px rgba(217, 119, 6, 0.3)'
      ],
      duration: 4000,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true
    });

    // Random ember bursts - removing confetti calls
    const emberInterval = setInterval(() => {
      if (Math.random() > 0.65) {
        const randomX = Math.random();
        const randomY = Math.random();
        createEmberBurst({ x: randomX, y: randomY }, 0.5);
      }
    }, 7000);

    return () => {
      clearInterval(emberInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-serif text-gray-300">
      {/* Enhanced background effects */}
      <AshParticles />
      <EmberBackground />
      <FogEffect />
      
      {/* Background glowing orbs for dramatic effect */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-amber-900 opacity-5 blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-yellow-900 opacity-3 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent opacity-90"></div>

      {/* Enhanced grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNjAgNjBIMFYwaDYwdjYwem0tMjAgMEgwVjBoNDB2NDB6bS0yMCAwSDBWMGgyMHYyMHoiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMikiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] opacity-10"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced header with gothic souls-like aesthetics */}
        <header 
          ref={headerRef} 
          className="flex justify-between items-center py-6 px-8 rounded-lg backdrop-blur-md bg-black bg-opacity-80 border border-gray-800 border-opacity-60 shadow-2xl mb-16"
        >
          <div className="flex items-center">
            <div className="mr-4">
              <AnimatedBonfire />
            </div>
            <div>
              <h1 
                ref={titleRef}
                className="text-5xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-800 tracking-wider"
              >
                ASHEN CODE
              </h1>
              <p className="text-gray-500 text-sm italic">Link the flame, code eternal</p>
            </div>
          </div>

          <nav className="flex items-center space-x-8">
            {/* Soul level progress with enhanced visuals */}
            <div className="hidden md:block">
              <div className="flex items-center mb-2">
                <span className="text-amber-400 text-xs font-bold font-mono mr-3">SOUL LVL 5</span>
                <div className="h-2 w-40 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                  <div className="h-full bg-gradient-to-r from-amber-900 to-yellow-700 w-3/4 relative">
                    {/* Animated flames along progress bar */}
                    <div className="absolute top-0 right-0 h-full w-1 bg-amber-400 animate-pulse" style={{filter: 'blur(1px)'}}></div>
                  </div>
                </div>
                <span className="text-amber-400 text-xs font-bold font-mono ml-3">SOUL LVL 6</span>
              </div>
              <p className="text-gray-500 text-xs text-center font-mono">750 / 1000 XP</p>
            </div>

            {/* Enhanced soul counter with animation */}
            <motion.div
              className="flex items-center bg-gradient-to-r from-black to-amber-900 text-gray-200 px-5 py-2.5 rounded-lg shadow-xl border border-amber-900"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3, times: [0, 0.5, 1] }}
              key={soulCount}
            >
              <GiBurningEmbers className="mr-2 text-xl text-amber-500" />
              <span className="font-bold text-lg font-mono">{soulCount}</span>
            </motion.div>

            {/* Enhanced ember/hollow toggle button */}
            <motion.button
              onClick={handleEmberToggle}
              className={`${isEmbered
                ? 'bg-gradient-to-r from-black to-yellow-900 border-yellow-900'
                : 'bg-gradient-to-r from-black to-amber-900 border-amber-900'}
                font-serif font-bold py-3 px-6 rounded-lg shadow-xl flex items-center border transition-colors duration-500`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isEmbered ? (
                <>
                  <FaUserAstronaut className="mr-2 text-gray-400" />
                  <span className="font-serif tracking-wide">HOLLOW</span>
                </>
              ) : (
                <>
                  <GiBurningEmbers className="mr-2 text-amber-500" />
                  <span className="font-serif tracking-wide">EMBERED</span>
                </>
              )}
            </motion.button>
          </nav>
        </header>

        <main className="space-y-24">
          {/* Enhanced hero section with more dramatic elements */}
          <section className="text-center relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-12"
            >
              <h2 className="text-7xl font-serif font-extrabold text-gray-100 mb-4 tracking-widest drop-shadow-2xl">
                Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-900">Covenant</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8 font-serif italic">
                Embark on a treacherous journey through the abyss of code. Choose your covenant and kindle the flame of knowledge.
              </p>
              
              {/* Floating decoration elements */}
              <div className="floating-soul absolute -top-6 left-1/4 text-3xl text-amber-500 opacity-70">✨</div>
              <div className="floating-soul absolute top-8 right-1/4 text-2xl text-amber-600 opacity-60 transform rotate-12">⚔️</div>
              <div className="floating-soul absolute -bottom-10 left-1/3 text-4xl text-yellow-700 opacity-70 transform -rotate-12">🔮</div>
            </motion.div>
            
            {/* Moved covenant selection here - above achievements */}
            <section className="relative mb-16">
              {/* Decorative elements */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 opacity-30 hidden xl:block">
                <AnimatedSword />
              </div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 opacity-30 hidden xl:block">
                <AnimatedSword />
              </div>
              
              <h3 className="text-3xl font-serif font-bold text-center mb-12 tracking-widest">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-800">SACRED COVENANTS</span>
              </h3>
              
              {/* Covenant cards with ids for effect targeting */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-6">
                {covenants.map((covenant, index) => (
                  <motion.div
                    key={covenant.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.7, delay: index * 0.15 }}
                    className="h-full" // Ensure grid cells are full height
                  >
                    <CovenantCard
                      {...covenant}
                      onClick={handleCovenantSelect}
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Keep the achievements banner here - now below the covenant selection */}
            <div className="mt-6 mb-12">
              <motion.div
                className="bg-gradient-to-br from-gray-950 to-black bg-opacity-90 backdrop-blur-md border border-gray-800 rounded-lg p-6 md:p-8 max-w-5xl mx-auto shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h3 className="text-2xl font-serif font-bold text-gray-200 mb-6 flex items-center justify-center tracking-wider">
                  <FaSkull className="text-amber-600 mr-3" />
                  YOUR DARK TRIUMPHS
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {achievements.map((achievement, index) => (
                    <SoulBadge key={index} {...achievement} />
                  ))}
                </div>

                <motion.div
                  className="mt-8 text-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <button className="bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-gray-800 text-gray-300 text-sm font-medium py-2.5 px-5 rounded-lg border border-gray-800 shadow-lg tracking-wide">
                    VIEW ALL TRIUMPHS
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Enhanced daily challenges and leaderboard section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-900 to-black flex items-center justify-center text-gray-200 mr-4 border border-amber-900 shadow-lg">
                  <GiBurningEmbers className="text-2xl text-amber-500" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-gray-200 tracking-wider">Bonfire Trials</h3>
              </div>

              <div className="space-y-5">
                {dailyChallenges.map((quest) => (
                  <div key={quest.id} id={`quest-${quest.id}`}>
                    <BonfireChallenge
                      quest={quest}
                      onClaim={handleChallengeKindle}
                      claimed={claimedChallenges.includes(quest.id)}
                    />
                  </div>
                ))}
              </div>
              
              {/* Bonfire visual for atmospheric effect */}
              <div className="mt-10 flex justify-center">
                <AnimatedBonfire />
              </div>
            </div>

            <div>
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-900 to-black flex items-center justify-center mr-4 border border-amber-900 shadow-lg">
                  <GiChainedHeart className="text-2xl text-amber-500" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-gray-200 tracking-wider">Undying Champions</h3>
              </div>

              <div className="space-y-5">
                {players.map((player, index) => (
                  <HollowedPlayer key={index} player={player} rank={index} />
                ))}

                <motion.button
                  className="w-full py-3 bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-gray-800 text-gray-300 rounded-lg border border-gray-800 mt-5 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="mr-2 tracking-wide font-serif">VIEW ALL CHAMPIONS</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-24 text-center text-gray-500 relative z-10 border-t border-gray-800 pt-10">
          <div ref={flameRef} className="relative w-full h-6 mb-6">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="flame-particle absolute bottom-0 w-1.5 h-3 rounded-full bg-amber-500 opacity-0"
                style={{
                  left: `${10 + (i * 8)}%`,
                  filter: 'blur(1px)'
                }}
              />
            ))}
          </div>
          <p className="flex items-center justify-center">
            <GiBurningEmbers className="text-amber-600 mr-2" />
            Kindle the flame with every challenge completed
          </p>
          <p className="mt-4 font-serif">&copy; 2024 Ashen Code. All souls consumed.</p>
        </footer>
      </div>
    </div>
  );
};

export default LanguageSelectionPage;