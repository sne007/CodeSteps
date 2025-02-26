import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import { useCurriculum } from "./context/CurriculumContext";
import { animateStars } from "../utils/animateStars";
import LanguageLoadingAnimation from "./LanguageLoading";
import {
  FaPlay,
  FaTrash,
  FaUndo,
  FaRedo,
  FaStar,
  FaLock,
  FaChevronDown,
  FaCheckCircle,
  FaChevronRight,
  FaChevronLeft,
  FaRocket,
  FaUserAstronaut,
  FaCode
} from 'react-icons/fa';
import { RiSwordFill, RiShieldFill, RiMagicFill } from 'react-icons/ri';
import { GiCrystalBall, GiFireGem, GiSpellBook, GiCursedStar } from 'react-icons/gi';

// Component for the CodeQuest Logo
const Logo = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 17L12 22L22 17" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12L12 17L22 12" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Animated logo component
const AnimatedLogo = () => {
  const logoRef = useRef(null);

  useEffect(() => {
    if (window.anime) {
      const animation = window.anime({
        targets: logoRef.current.querySelectorAll('path'),
        strokeDashoffset: [window.anime.setDashoffset, 0],
        easing: 'easeInOutCubic',
        duration: 3000,
        delay: (el, i) => i * 250,
        direction: 'alternate',
        loop: true
      });

      return () => animation.pause();
    }
  }, []);

  return (
    <svg ref={logoRef} className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

// Floating particles component
const ParticleBackground = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    if (!window.anime) return;

    const particles = [];
    const colors = ['#10B981', '#06B6D4', '#3B82F6', '#F59E0B', '#EC4899'];
    const container = particlesRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    // Create particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.width = `${Math.random() * 6 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.opacity = Math.random() * 0.4 + 0.1;

      // Random starting position
      particle.style.left = `${Math.random() * containerRect.width}px`;
      particle.style.top = `${Math.random() * containerRect.height}px`;

      container.appendChild(particle);
      particles.push(particle);

      // Animate each particle
      window.anime({
        targets: particle,
        translateX: () => window.anime.random(-100, 100),
        translateY: () => window.anime.random(-100, 100),
        opacity: [
          { value: Math.random() * 0.6, duration: 1000 },
          { value: 0.1, duration: 1000 }
        ],
        scale: [
          { value: Math.random() + 0.5, duration: 1000 },
          { value: 0, duration: 1000 }
        ],
        rotate: () => window.anime.random(-360, 360),
        duration: () => window.anime.random(6000, 15000),
        easing: 'easeInOutQuad',
        loop: true,
        delay: window.anime.random(0, 5000)
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

// Component for individual test cases
const TestCase = ({ test, result }) => (
  <div className="p-3 bg-slate-800 bg-opacity-40 rounded-lg border border-slate-700 flex items-center space-x-3 transition-all hover:bg-opacity-60">
    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-cyan-700 rounded-full">
      <span className="text-white font-medium">{test.id}</span>
    </div>
    <div className="flex-grow min-w-0">
      <p className="text-sm text-gray-300">{test.description}</p>
      <div className="flex items-center text-xs space-x-2 text-gray-400 mt-1">
        <span>Expected:</span>
        <code className="bg-slate-700 px-2 py-1 rounded">{test.expected.trim()}</code>
      </div>
    </div>
    {result && (
      <div className={`flex-shrink-0 text-2xl ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
        {result.passed ? '✓' : '✗'}
      </div>
    )}
  </div>
);

// Helper function to dynamically load scripts
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Improved TopicCard component with cybernetic aesthetic
const TopicCard = ({ topic, onSelect, isSelected, completedQuestions, onQuestionSelect, selectedQuestion }) => {
  const [isExpanded, setIsExpanded] = useState(isSelected);
  const completedCount = topic.questions.filter(qId => completedQuestions.includes(qId)).length;
  const progress = (completedCount / topic.questions.length) * 100;

  useEffect(() => {
    // Auto-expand when topic is selected
    if (isSelected) {
      setIsExpanded(true);
    }
  }, [isSelected]);

  const handleClick = () => {
    if (!topic.locked) {
      setIsExpanded(!isExpanded);
      onSelect(topic);
    }
  };

  return (
    <motion.div
      layout
      className={`
        ${topic.locked
          ? 'from-slate-700 to-slate-800 border-slate-600'
          : isSelected
            ? 'from-cyan-700 to-cyan-900 border-cyan-500'
            : 'from-cyan-600 to-cyan-800 border-cyan-400'}
        bg-gradient-to-br rounded shadow-lg overflow-hidden cursor-pointer relative mb-4 w-full transition-all border
      `}
      onClick={handleClick}
      initial={false}
      whileHover={!topic.locked ? {
        boxShadow: "0 4px 12px rgba(8, 145, 178, 0.6)",
        transition: { duration: 0.2 }
      } : {}}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
      }}
    >
      <motion.div layout className="p-3">
        <motion.div layout className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white flex items-center">
            {topic.locked && <FaLock className="mr-2 text-cyan-300 text-sm" />}
            {topic.name}
          </h3>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-cyan-300 text-sm"
          >
            <FaChevronDown />
          </motion.div>
        </motion.div>

        <motion.div layout className="w-full bg-slate-800 bg-opacity-50 rounded-full h-1.5 mt-2">
          <motion.div
            className="bg-cyan-400 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.p layout className="text-xs text-cyan-200 mt-1">
          {completedCount}/{topic.questions.length} completed
        </motion.p>
      </motion.div>

      <AnimatePresence initial={false}>
        {isExpanded && !topic.locked && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={{
              expanded: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="bg-slate-800 bg-opacity-70 overflow-hidden"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
            }}
          >
            {topic.questions.map((questionId) => {
              const isSelected = selectedQuestion && selectedQuestion.id === questionId;
              const isCompleted = completedQuestions.includes(questionId);

              return (
                <motion.div
                  key={questionId}
                  className={`
                    p-2 m-1.5 rounded cursor-pointer transition-all duration-200
                    flex justify-between items-center relative overflow-hidden border
                    ${isSelected
                      ? 'bg-cyan-700 bg-opacity-40 border-cyan-500'
                      : isCompleted
                        ? 'bg-green-700 bg-opacity-20 border-green-600'
                        : 'bg-slate-700 bg-opacity-40 border-slate-600'}
                  `}
                  whileHover={{
                    backgroundColor: 'rgba(6, 182, 212, 0.3)',
                    transition: { duration: 0.1 }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuestionSelect(questionId);
                  }}
                >
                  {isSelected && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <p className={`text-sm font-medium relative z-10 ${
                    isSelected
                      ? 'text-cyan-300'
                      : 'text-gray-200'
                  }`}>
                    Question {questionId}
                  </p>
                  {isCompleted && (
                    <div className="bg-green-800 bg-opacity-30 rounded-full p-1">
                      <FaCheckCircle className="text-green-400 text-xs relative z-10" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Test Cases Panel Component with Tabs
const TestCasesPanel = ({ testCases, testResults, runTestCases, output, clearOutput }) => {
  const [activeTab, setActiveTab] = useState('console'); // tabs: 'console', 'tests', 'results', 'hints'

  return (
    <div className="bg-slate-800/70 backdrop-filter backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700/50">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-700">
        <button
          onClick={() => setActiveTab('console')}
          className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${
            activeTab === 'console'
              ? 'bg-cyan-700/80 text-white'
              : 'text-gray-300 hover:bg-slate-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${activeTab === 'console' ? 'text-cyan-300' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Console
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${
            activeTab === 'tests'
              ? 'bg-cyan-700/80 text-white'
              : 'text-gray-300 hover:bg-slate-700'
          }`}
        >
          <FaChevronRight className={`mr-2 ${activeTab === 'tests' ? 'text-cyan-300' : ''}`} />
          Test Cases
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${
            activeTab === 'results'
              ? 'bg-cyan-700/80 text-white'
              : 'text-gray-300 hover:bg-slate-700'
          }`}
        >
          <FaCheckCircle className={`mr-2 ${activeTab === 'results' ? 'text-cyan-300' : ''}`} />
          Results {testResults.length > 0 && `(${testResults.filter(r => r.passed).length}/${testResults.length})`}
        </button>

        <button
          onClick={() => setActiveTab('hints')}
          className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${
            activeTab === 'hints'
              ? 'bg-cyan-700/80 text-white'
              : 'text-gray-300 hover:bg-slate-700'
          }`}
        >
          <FaStar className={`mr-2 ${activeTab === 'hints' ? 'text-cyan-300' : ''}`} />
          Hints
        </button>

        <div className="ml-auto pr-4 py-2">
          {activeTab === 'console' ? (
            <button
              onClick={clearOutput}
              className="bg-slate-600 hover:bg-slate-700 text-white text-sm py-1 px-3 rounded transition-colors"
            >
              Clear Console
            </button>
          ) : activeTab === 'tests' || activeTab === 'results' ? (
            <button
              onClick={runTestCases}
              className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm py-1 px-3 rounded transition-colors flex items-center"
            >
              <FaPlay className="mr-1" /> Run Tests
            </button>
          ) : null}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'console' && (
          <div className="h-48 overflow-y-auto bg-slate-900/80 text-green-400 font-mono text-sm p-4 rounded-xl border border-slate-700/50 shadow-inner"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
            }}
          >
            <pre className="whitespace-pre-wrap">{output || 'Run your code to see output here'}</pre>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {testCases.map((test) => (
              <TestCase
                key={test.id}
                test={test}
                result={testResults.find(r => r.id === test.id)}
              />
            ))}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-4">
            {testResults.length > 0 ? (
              <>
                <div className="flex items-center mb-4">
                  <div className="flex-1 bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full"
                      style={{ width: `${(testResults.filter(r => r.passed).length / testResults.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-4 text-white font-medium">
                    {testResults.filter(r => r.passed).length}/{testResults.length} Passed
                  </span>
                </div>

                {testResults.map((result) => {
                  const test = testCases.find(t => t.id === result.id);
                  return (
                    <div key={result.id} className={`p-4 rounded-lg ${result.passed ? 'bg-green-900 bg-opacity-20 border border-green-800/30' : 'bg-red-900 bg-opacity-20 border border-red-800/30'}`}>
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 mr-3 text-xl ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                          {result.passed ? '✓' : '✗'}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Test Case {result.id}</h4>
                          <p className="text-sm text-gray-300">{test?.description}</p>
                        </div>
                      </div>
                      {!result.passed && (
                        <div className="mt-3 pt-3 border-t border-red-800/30 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-400 mb-1">Expected:</p>
                              <pre className="bg-slate-800 p-2 rounded text-green-300 text-xs overflow-x-auto">{test?.expected}</pre>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-1">Actual:</p>
                              <pre className="bg-slate-800 p-2 rounded text-red-300 text-xs overflow-x-auto">{result.output}</pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-300 mb-4">No test results yet</p>
                <button
                  onClick={runTestCases}
                  className="bg-cyan-700 hover:bg-cyan-800 text-white py-2 px-4 rounded transition-colors"
                >
                  Run Tests Now
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hints' && (
          <div className="space-y-4 text-gray-300">
            <div className="bg-cyan-900/30 rounded-lg p-4 border-l-4 border-cyan-500">
              <h4 className="font-medium text-cyan-300 mb-2">Hint 1:</h4>
              <p>Remember to check your syntax carefully. In Python, proper indentation is crucial.</p>
            </div>
            <div className="bg-cyan-900/30 rounded-lg p-4 border-l-4 border-cyan-500">
              <h4 className="font-medium text-cyan-300 mb-2">Hint 2:</h4>
              <p>Try breaking down the problem into smaller steps. What's the first thing you need to do?</p>
            </div>
            <div className="text-center mt-6">
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Reveal Solution (Costs 5 Points)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced skill tree component with simplified grid layout
const HexSkillTree = ({ curriculum, completedQuestions, onTopicSelect, onQuestionSelect, selectedTopic, selectedQuestion }) => {
  const containerRef = useRef(null);

  // Helper function to truncate text
  function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }

  // Simplified direct question selection
  const handleQuestionClick = (questionId) => {
    const question = curriculum.questions.find(q => q.id === questionId);
    if (!question) return;

    // Find the parent topic
    const parentTopic = curriculum.topics.find(topic =>
      topic.questions.includes(questionId)
    );

    if (parentTopic) {
      // First select the topic, then the question
      onTopicSelect(parentTopic);
      onQuestionSelect(questionId);
    }
  };

  // Simple tile-based question grid
  return (
    <div ref={containerRef} className="w-full h-full p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-cyan-300 mb-6">Available Questions</h3>

        {curriculum.topics.map((topic) => !topic.locked && (
          <div key={topic.id} className="mb-8">
            <div
              className={`p-4 rounded-lg mb-4 cursor-pointer ${
                selectedTopic && selectedTopic.id === topic.id
                  ? 'bg-cyan-700 bg-opacity-40 border border-cyan-500 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800 bg-opacity-40 border border-slate-700 hover:border-cyan-600'
              }`}
              onClick={() => onTopicSelect(topic)}
            >
              <h4 className="text-xl font-bold text-white flex items-center">
                <span className="w-8 h-8 flex items-center justify-center bg-cyan-600 rounded-lg mr-3 text-white">
                  {topic.id}
                </span>
                {topic.name}
                <div className="ml-auto flex items-center">
                  <div className="h-2 w-24 bg-slate-700 rounded-full overflow-hidden mr-3">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-teal-500"
                      style={{
                        width: `${(topic.questions.filter(q => completedQuestions.includes(q)).length / topic.questions.length) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-cyan-300">
                    {topic.questions.filter(q => completedQuestions.includes(q)).length}/{topic.questions.length}
                  </span>
                </div>
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topic.questions.map((questionId) => {
                const question = curriculum.questions.find(q => q.id === questionId);
                const isCompleted = completedQuestions.includes(questionId);
                const isSelected = selectedQuestion && selectedQuestion.id === questionId;

                return question && (
                  <motion.div
                    key={questionId}
                    className={`p-4 rounded-lg cursor-pointer border ${
                      isSelected
                        ? 'bg-cyan-700 bg-opacity-40 border-cyan-500 shadow-lg shadow-cyan-500/20'
                        : isCompleted
                          ? 'bg-green-800 bg-opacity-20 border-green-600'
                          : 'bg-slate-800 bg-opacity-50 border-slate-700 hover:border-cyan-600'
                    }`}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={() => handleQuestionClick(questionId)}
                  >
                    <div className="flex items-start mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                        isCompleted
                          ? 'bg-green-600'
                          : isSelected
                            ? 'bg-cyan-600'
                            : 'bg-slate-700'
                      }`}>
                        {questionId}
                      </div>
                      <h5 className="text-lg font-bold text-white">{question.title}</h5>
                    </div>

                    <p className="text-gray-300 text-sm mb-3 ml-11">
                      {truncateText(question.description, 80)}
                    </p>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <span className="text-xs text-cyan-300 bg-cyan-900 bg-opacity-40 px-2 py-1 rounded">
                          {question.points} POINTS
                        </span>
                      </div>

                      {isCompleted && (
                        <div className="flex items-center text-green-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-medium">COMPLETED</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main CurriculumPage Component
const CurriculumPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showQuestionsPanel, setShowQuestionsPanel] = useState(false);
  const { languageId } = useParams();
  const {
    curriculum,
    selectedTopic,
    setSelectedTopic,
    selectedQuestion,
    setSelectedQuestion,
    score,
    setScore,
    completeQuestion,
    completedQuestions
  } = useCurriculum();

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const outputRef = useRef('');

  // Mock test cases - could be fetched from API in a real app
  const testCases = [
    { id: 1, description: "Should print 'Hello, World!'", expected: "Hello, World!\n" },
    { id: 2, description: "Should handle empty input", expected: "Hello, World!\n" }
  ];

  // Loading simulation effect
  useEffect(() => {
    // Load anime.js if it's not already loaded
    const loadAnimeJS = async () => {
      if (!window.anime) {
        try {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js');
        } catch (error) {
          console.error("Failed to load anime.js:", error);
        }
      }
    };

    loadAnimeJS();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Run user code function
  const runCode = () => {
    setIsExecuting(true);
    outputRef.current = '';
    setOutput('');
    const customLog = (...args) => {
      outputRef.current += args.join(' ') + "\n";
      setOutput(outputRef.current);
    };
    const modifiedCode = code
      .replace(/console\.log/g, 'customLog')
      .replace(/print\s*\(/g, 'customLog(');

    try {
      const execFunc = new Function('customLog', modifiedCode);
      execFunc(customLog);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }

    setIsExecuting(false);
  };

  // Handle running user code for test cases
  const runUserCode = () => {
    return new Promise((resolve) => {
      outputRef.current = '';
      setOutput('');
      const customLog = (...args) => {
        outputRef.current += args.join(' ') + "\n";
        setOutput(outputRef.current);
      };
      const modifiedCode = code
        .replace(/console\.log/g, 'customLog')
        .replace(/print\s*\(/g, 'customLog(');

      try {
        const execFunc = new Function('customLog', modifiedCode);
        execFunc(customLog);
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      }

      setTimeout(() => {
        resolve(outputRef.current);
      }, 300);
    });
  };

  // Clear code and output
  const handleClearCode = () => {
    setCode('');
    outputRef.current = '';
    setOutput('');
    setFeedback(null);
  };

  // Handle submission
  const handleSubmit = () => {
    setFeedback({ type: 'success', message: 'Correct! Great job!' });
    if (selectedQuestion) {
      animateStars(selectedQuestion.points, setScore);
      completeQuestion(selectedQuestion.id);
    }
  };

  // Run all test cases
  const runTestCases = async () => {
    const results = [];
    for (let test of testCases) {
      const result = await runUserCode();
      const passed = result.trim() === test.expected.trim();
      results.push({ id: test.id, passed, output: result });
    }
    setTestResults(results);
  };

  // Handle topic selection
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  // Handle question selection
  const handleQuestionSelect = (questionId) => {
    const question = curriculum.questions.find(q => q.id === questionId);
    setSelectedQuestion(question);
    setShowQuestionsPanel(false); // Close the panel after selection
  };

  if (isLoading) {
    return <LanguageLoadingAnimation languageId={languageId} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
      }}
    >
      {/* Floating particles effect */}
      <ParticleBackground />

      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 to-cyan-900/10 pointer-events-none"></div>

      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-600 opacity-5 blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-teal-600 opacity-5 blur-3xl"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 60H0V0h60v60zm-20 0H0V0h40v40zm-20 0H0V0h20v20z' fill='%2306B6D4' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      ></div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 relative z-80 py-4 px-6 rounded-2xl backdrop-blur-md bg-slate-800 bg-opacity-30 border border-slate-600 border-opacity-50 shadow-lg">
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

            <div className="relative mr-4">
              <motion.button
                onClick={() => setShowQuestionsPanel(!showQuestionsPanel)}
                className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-4 py-2 rounded-lg flex items-center border border-cyan-400 shadow-lg hover:shadow-cyan-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">Skill Tree</span>
                <FaChevronDown className={`transform transition-transform ${showQuestionsPanel ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* Questions Panel */}
              {showQuestionsPanel && (
                <>
                  {/* Backdrop blur overlay */}
                  <div
                    className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-[9990]"
                    onClick={() => setShowQuestionsPanel(false)}
                  ></div>

                  {/* Enhanced Question Selection Panel */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed inset-4 rounded-xl shadow-2xl z-[9999] overflow-hidden flex flex-col border border-slate-600"
                    style={{
                      background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.98) 100%)',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
                    }}
                  >
                    <div
                      className="p-4 flex justify-between items-center"
                      style={{
                        background: 'linear-gradient(to right, rgba(8,145,178,0.9) 0%, rgba(6,182,212,0.7) 100%)',
                        borderBottom: '1px solid rgba(6,182,212,0.5)',
                      }}
                    >
                      <h3 className="text-2xl font-bold text-white flex items-center">
                        <FaStar className="mr-2 text-cyan-200" />
                        <span>Select Question</span>
                      </h3>
                      <button
                        onClick={() => setShowQuestionsPanel(false)}
                        className="text-cyan-100 hover:text-white p-2 rounded-full hover:bg-cyan-800/50 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex-grow overflow-hidden">
                      {/* Question selection grid */}
                      <div className="h-full">
                        {curriculum && (
                          <HexSkillTree
                            curriculum={curriculum}
                            completedQuestions={completedQuestions}
                            onTopicSelect={handleTopicSelect}
                            onQuestionSelect={handleQuestionSelect}
                            selectedTopic={selectedTopic}
                            selectedQuestion={selectedQuestion}
                          />
                        )}
                      </div>
                    </div>

                    <div
                      className="p-4 flex justify-between items-center"
                      style={{
                        background: 'linear-gradient(to right, rgba(8,145,178,0.9) 0%, rgba(6,182,212,0.7) 100%)',
                        borderTop: '1px solid rgba(6,182,212,0.5)',
                      }}
                    >
                      <div className="flex items-center">
                        <div className="mr-4 flex items-center bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-900 px-4 py-1.5 rounded-full shadow-lg border border-cyan-300">
                          <FaStar className="mr-2" />
                          <span className="font-bold text-lg">{score}</span>
                        </div>
                        <p className="text-cyan-100 text-sm">
                          Unlock new skills with points earned from challenges!
                        </p>
                      </div>
                      <motion.button
                        onClick={() => setShowQuestionsPanel(false)}
                        className="bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-medium px-4 py-2 rounded-lg shadow-lg transition-all border border-cyan-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Return to Quest
                      </motion.button>
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            <motion.div
              className="flex items-center bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-4 py-2 rounded-xl shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3, times: [0, 0.5, 1] }}
              key={score}
            >
              <FaStar className="mr-2" />
              <span className="font-bold">{score}</span>
            </motion.div>

            <button className="text-cyan-300 hover:text-cyan-200 transition-colors font-medium px-4 py-2 rounded-lg">
              Profile
            </button>
          </nav>
        </header>

        {/* Main content area */}
        <main className="flex flex-row relative z-10 h-[calc(100vh-180px)] gap-6">
          {/* Left panel - 33% width */}
          <div className="w-1/3 overflow-y-auto rounded-xl">
            {selectedQuestion ? (
              <div className="bg-slate-900/80 p-6 rounded-xl shadow-lg h-full border border-slate-700"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
                }}
              >
                <div className="bg-slate-800/80 p-4 rounded-lg mb-6 border border-slate-700">
                  <h3 className="text-2xl font-bold text-cyan-300">
                    {selectedQuestion.title}
                  </h3>
                  <div className="flex items-center mt-3 flex-wrap gap-2">
                    <span className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-cyan-400">
                      {selectedQuestion.points} POINTS
                    </span>
                    <span className="bg-slate-700/70 text-gray-200 text-xs px-3 py-1.5 rounded-full border border-slate-600">
                      {selectedTopic?.name}
                    </span>
                    {/* Status tag */}
                    <span className={`text-xs px-3 py-1.5 rounded-full shadow-sm border ${
                      completedQuestions.includes(selectedQuestion.id)
                        ? 'bg-green-700/50 text-white border-green-600'
                        : feedback && feedback.type === 'success'
                          ? 'bg-cyan-600/50 text-white border-cyan-500'
                          : 'bg-slate-700/70 text-gray-300 border-slate-600'
                    }`}>
                      {completedQuestions.includes(selectedQuestion.id)
                        ? 'Solved'
                        : feedback && feedback.type === 'success'
                          ? 'Attempted'
                          : 'Unsolved'}
                    </span>
                  </div>
                </div>

                {/* Problem description */}
                <div className="bg-slate-800/50 rounded-lg p-5 shadow-inner border border-slate-700">
                  <h4 className="text-sm font-medium text-cyan-200 mb-3 flex items-center">
                    <FaChevronRight className="mr-2 text-xs text-cyan-400" />
                    Problem Description
                  </h4>
                  <div className="text-gray-200 space-y-4 leading-relaxed">
                    <p>{selectedQuestion.description}</p>
                  </div>

                  {/* Example section */}
                  <div className="mt-6 pt-4 border-t border-slate-700">
                    <h4 className="text-sm font-medium text-cyan-200 mb-3 flex items-center">
                      <FaChevronRight className="mr-2 text-xs text-cyan-400" />
                      Example
                    </h4>
                    <div className="bg-slate-900/70 rounded-lg p-3 font-mono text-sm text-gray-300 border border-slate-700">
                      <p className="mb-2 text-cyan-400">Input:</p>
                      <pre className="mb-4">["hello", "world"]</pre>
                      <p className="mb-2 text-cyan-400">Output:</p>
                      <pre>["HELLO", "WORLD"]</pre>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-8 bg-slate-900/70 rounded-xl max-w-xl shadow-lg border border-slate-700"
                >
                  <div className="text-6xl mb-6">🚀</div>
                  <h3 className="text-3xl font-bold text-cyan-300 mb-4">
                    Ready to start coding?
                  </h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    Select a question from the skill tree to begin your coding journey
                  </p>
                  <motion.button
                    onClick={() => setShowQuestionsPanel(true)}
                    className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all flex items-center mx-auto border border-cyan-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-2">Open Skill Tree</span>
                    <FaChevronRight />
                  </motion.button>
                </motion.div>
              </div>
            )}
          </div>

          {/* Right panel - 67% width */}
          <div className="w-2/3 flex flex-col overflow-hidden rounded-xl shadow-xl bg-slate-900/90 border border-slate-700">
            {selectedQuestion ? (
              <>
                {/* Code Editor Header with Run and Submit buttons */}
                <div className="bg-slate-800 text-white p-4 flex justify-between items-center border-b border-slate-700 rounded-t-xl">
                  <div className="flex space-x-2 items-center">
                    <button onClick={handleClearCode} className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Clear Code">
                      <FaTrash />
                    </button>
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Undo">
                      <FaUndo />
                    </button>
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Redo">
                      <FaRedo />
                    </button>
                    <div className="text-sm text-gray-300 ml-3 flex items-center">
                      <span className="bg-slate-700 text-gray-200 text-xs px-3 py-1 rounded-full border border-slate-600">main.py</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={runCode}
                      className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:from-cyan-700 hover:to-cyan-800 transition duration-300 flex items-center border border-cyan-500"
                      disabled={isExecuting}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaPlay className="mr-2" /> {isExecuting ? 'Running...' : 'Run Code'}
                    </motion.button>
                    <motion.button
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:from-green-700 hover:to-green-800 transition duration-300 flex items-center border border-green-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaCheckCircle className="mr-2" /> Submit
                    </motion.button>
                  </div>
                </div>

                {/* Code Editor - explicit height to ensure proper stacking */}
                <div className="relative flex-grow rounded-bl-xl rounded-br-xl overflow-hidden">
                  <AceEditor
                    mode="python"
                    theme="monokai"
                    onChange={setCode}
                    name="code-editor"
                    editorProps={{ $blockScrolling: true }}
                    width="100%"
                    height="100%"
                    fontSize={14}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={code}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: true,
                    }}
                  />
                </div>

                {/* Bottom panel with tabs */}
                <div className="border-t border-slate-700 mt-auto">
                  <TestCasesPanel
                    testCases={testCases}
                    testResults={testResults}
                    runTestCases={runTestCases}
                    output={output}
                    clearOutput={() => setOutput('')}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-slate-900/70 rounded-xl">
                <div className="text-center p-8">
                  <svg className="w-16 h-16 mx-auto mb-6 text-cyan-500 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <p className="text-gray-400 text-lg font-medium">
                    Select a question to start coding
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-6 text-center text-gray-400 relative z-10">
          <p>© 2024 CodeQuest. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default CurriculumPage;