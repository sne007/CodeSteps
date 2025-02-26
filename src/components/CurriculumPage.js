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
  FaChevronLeft
} from 'react-icons/fa';

// Component for the CodeQuest Logo
const Logo = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 17L12 22L22 17" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12L12 17L22 12" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Component for individual test cases
const TestCase = ({ test, result }) => (
  <div className="p-3 bg-stone-800 bg-opacity-40 rounded-lg border border-stone-700 flex items-center space-x-3 transition-all hover:bg-opacity-60">
    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-amber-700 rounded-full">
      <span className="text-white font-medium">{test.id}</span>
    </div>
    <div className="flex-grow min-w-0">
      <p className="text-sm text-gray-300">{test.description}</p>
      <div className="flex items-center text-xs space-x-2 text-gray-400 mt-1">
        <span>Expected:</span>
        <code className="bg-stone-700 px-2 py-1 rounded">{test.expected.trim()}</code>
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

// Improved TopicCard component - imported from separate artifact
// const TopicCard = ... (use the improved component)

// Improved TopicCard component with rugged aesthetic
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
          ? 'from-stone-700 to-stone-800 border-stone-600'
          : isSelected
            ? 'from-amber-700 to-amber-900 border-amber-600'
            : 'from-amber-600 to-amber-800 border-amber-500'}
        bg-gradient-to-br rounded shadow-md overflow-hidden cursor-pointer relative mb-4 w-full transition-all border
      `}
      onClick={handleClick}
      initial={false}
      whileHover={!topic.locked ? {
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        transition: { duration: 0.2 }
      } : {}}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
      }}
    >
      <motion.div layout className="p-3">
        <motion.div layout className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white flex items-center">
            {topic.locked && <FaLock className="mr-2 text-amber-300 text-sm" />}
            {topic.name}
          </h3>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-amber-300 text-sm"
          >
            <FaChevronDown />
          </motion.div>
        </motion.div>

        <motion.div layout className="w-full bg-stone-800 bg-opacity-50 rounded-full h-1.5 mt-2">
          <motion.div
            className="bg-amber-400 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.p layout className="text-xs text-amber-200 mt-1">
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
            className="bg-stone-800 bg-opacity-70 overflow-hidden"
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
                      ? 'bg-amber-700 bg-opacity-40 border-amber-500'
                      : isCompleted
                        ? 'bg-green-700 bg-opacity-20 border-green-600'
                        : 'bg-stone-700 bg-opacity-40 border-stone-600'}
                  `}
                  whileHover={{
                    backgroundColor: 'rgba(217, 119, 6, 0.3)',
                    transition: { duration: 0.1 }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuestionSelect(questionId);
                  }}
                >
                  {isSelected && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <p className={`text-sm font-medium relative z-10 ${
                    isSelected
                      ? 'text-amber-300'
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
    <div className="bg-stone-800/70 backdrop-filter backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-stone-700/50">
      {/* Tabs Header */}
      <div className="flex border-b border-stone-700">
        <button
          onClick={() => setActiveTab('console')}
          className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${
            activeTab === 'console'
              ? 'bg-amber-700/80 text-white'
              : 'text-gray-300 hover:bg-stone-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${activeTab === 'console' ? 'text-amber-300' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Console
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${
            activeTab === 'tests'
              ? 'bg-amber-700/80 text-white'
              : 'text-gray-300 hover:bg-stone-700'
          }`}
        >
          <FaChevronRight className={`mr-2 ${activeTab === 'tests' ? 'text-amber-300' : ''}`} />
          Test Cases
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${
            activeTab === 'results'
              ? 'bg-amber-700/80 text-white'
              : 'text-gray-300 hover:bg-stone-700'
          }`}
        >
          <FaCheckCircle className={`mr-2 ${activeTab === 'results' ? 'text-amber-300' : ''}`} />
          Results {testResults.length > 0 && `(${testResults.filter(r => r.passed).length}/${testResults.length})`}
        </button>

        <button
          onClick={() => setActiveTab('hints')}
          className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${
            activeTab === 'hints'
              ? 'bg-amber-700/80 text-white'
              : 'text-gray-300 hover:bg-stone-700'
          }`}
        >
          <FaStar className={`mr-2 ${activeTab === 'hints' ? 'text-amber-300' : ''}`} />
          Hints
        </button>

        <div className="ml-auto pr-4 py-2">
          {activeTab === 'console' ? (
            <button
              onClick={clearOutput}
              className="bg-stone-600 hover:bg-stone-700 text-white text-sm py-1 px-3 rounded transition-colors"
            >
              Clear Console
            </button>
          ) : activeTab === 'tests' || activeTab === 'results' ? (
            <button
              onClick={runTestCases}
              className="bg-amber-600 hover:bg-amber-700 text-white text-sm py-1 px-3 rounded transition-colors flex items-center"
            >
              <FaPlay className="mr-1" /> Run Tests
            </button>
          ) : null}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'console' && (
          <div className="h-48 overflow-y-auto bg-stone-900/80 text-green-400 font-mono text-sm p-4 rounded-xl border border-stone-700/50 shadow-inner"
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
                  <div className="flex-1 bg-stone-700 h-2 rounded-full overflow-hidden">
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
                              <pre className="bg-stone-800 p-2 rounded text-green-300 text-xs overflow-x-auto">{test?.expected}</pre>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-1">Actual:</p>
                              <pre className="bg-stone-800 p-2 rounded text-red-300 text-xs overflow-x-auto">{result.output}</pre>
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
                  className="bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded transition-colors"
                >
                  Run Tests Now
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hints' && (
          <div className="space-y-4 text-gray-300">
            <div className="bg-amber-900/30 rounded-lg p-4 border-l-4 border-amber-500">
              <h4 className="font-medium text-amber-300 mb-2">Hint 1:</h4>
              <p>Remember to check your syntax carefully. In Python, proper indentation is crucial.</p>
            </div>
            <div className="bg-amber-900/30 rounded-lg p-4 border-l-4 border-amber-500">
              <h4 className="font-medium text-amber-300 mb-2">Hint 2:</h4>
              <p>Try breaking down the problem into smaller steps. What's the first thing you need to do?</p>
            </div>
            <div className="text-center mt-6">
              <button className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Reveal Solution (Costs 5 Points)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced HexSkillTree component - imported from separate artifact
// const HexSkillTree = ... (use the improved component)
// Enhanced HexSkillTree component with organized grid layout and rugged aesthetic
const HexSkillTree = ({ curriculum, completedQuestions, onTopicSelect, onQuestionSelect, selectedTopic, selectedQuestion }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 960, height: 600 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [subMenuPosition, setSubMenuPosition] = useState({ x: 0, y: 0 });
  const [subMenuContent, setSubMenuContent] = useState(null);

  useEffect(() => {
    // Load anime.js dynamically
    const loadAnimeJS = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js');
        // Initialize animations once anime.js is loaded
        const animeJS = window.anime;
        if (typeof animeJS !== 'undefined' && svgRef.current) {
          // Animate connection lines - simpler drawing animation
          animeJS({
            targets: '.connection-line',
            strokeDashoffset: [animeJS.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: 800,
            delay: function(el, i) { return i * 150 },
            direction: 'normal',
            loop: false
          });

          // Animate hexagons - simple fade-in
          animeJS({
            targets: '.hex-node',
            opacity: [0, 1],
            easing: 'easeInSine',
            duration: 400,
            delay: animeJS.stagger(100, {grid: [4, 4], from: 'first'})
          });
        }
      } catch (error) {
        console.error("Failed to load anime.js:", error);
      }
    };

    loadAnimeJS();

    // Update dimensions on resize
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSubMenu && !event.target.closest('.skill-submenu') &&
          !event.target.closest('.hex-node')) {
        setShowSubMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSubMenu]);

  // Generate a skill tree structure from curriculum data with grid alignment
  const generateSkillTree = () => {
    const allTopics = [...curriculum.topics];

    // Add mock topics that are locked
    const mockTopics = [
      { id: 6, name: 'Advanced Data Structures', locked: true, questions: [] },
      { id: 7, name: 'Algorithms', locked: true, questions: [] },
      { id: 8, name: 'Web Development', locked: true, questions: [] },
      { id: 9, name: 'Database Management', locked: true, questions: [] },
      { id: 10, name: 'Machine Learning Basics', locked: true, questions: [] },
    ];

    // Combine all topics
    const topics = [...allTopics, ...mockTopics];

    // Grid layout configuration - increased spacing for larger hexagons
    const gridSpacingX = 160;
    const gridSpacingY = 140;
    const startX = dimensions.width * 0.12;
    const startY = dimensions.height * 0.2;

    // Define a grid-based layout (similar to the screenshot)
    // First row: Basic skills (row 0)
    // Second row: Intermediate skills (row 1)
    // Third row: Advanced skills (row 2)
    // Fourth row: Expert skills (row 3)

    const grid = [
      // Row 0 - Basic skills
      [
        { type: 'topic', ...topics[0], row: 0, col: 0, available: true },
        { type: 'question', id: topics[0].questions[0], topicId: topics[0].id, row: 0, col: 1, available: true },
        { type: 'question', id: topics[0].questions[1], topicId: topics[0].id, row: 0, col: 2, available: true },
        { type: 'topic', ...topics[1], row: 0, col: 3, available: true },
      ],
      // Row 1 - Intermediate skills
      [
        { type: 'question', id: topics[1].questions[0], topicId: topics[1].id, row: 1, col: 0, available: true },
        { type: 'question', id: topics[1].questions[1], topicId: topics[1].id, row: 1, col: 1, available: true },
        { type: 'topic', ...topics[2], row: 1, col: 2, available: true },
        { type: 'question', id: topics[2].questions[0], topicId: topics[2].id, row: 1, col: 3, available: true },
      ],
      // Row 2 - Advanced skills
      [
        { type: 'topic', ...topics[5], row: 2, col: 0, available: false, locked: true },
        { type: 'topic', ...topics[6], row: 2, col: 1, available: false, locked: true },
        { type: 'topic', ...topics[7], row: 2, col: 2, available: false, locked: true },
        { type: 'topic', ...topics[8], row: 2, col: 3, available: false, locked: true },
      ],
      // Row 3 - Expert skills
      [
        { type: 'topic', ...topics[9], row: 3, col: 1.5, available: false, locked: true }
      ]
    ];

    // Convert grid to nodes with positions
    const nodes = [];
    const connections = [];

    // Process each row in the grid
    grid.forEach((row, rowIndex) => {
      row.forEach((node, colIndex) => {
        // Calculate position, with staggered rows for hexagonal grid
        const isOddRow = rowIndex % 2 === 1;
        const offsetX = isOddRow ? gridSpacingX / 2 : 0;

        const x = startX + (node.col * gridSpacingX) + offsetX;
        const y = startY + (rowIndex * gridSpacingY);

        // Add node with position
        const nodeWithPos = {
          ...node,
          x,
          y,
          connections: []
        };

        nodes.push(nodeWithPos);

        // Add connections based on progression
        if (rowIndex > 0 || colIndex > 0) {
          let connected = false;

          // Check if we should connect to the previous node in the same row
          if (colIndex > 0) {
            const prevNodeInRow = nodes.find(n => n.row === rowIndex && n.col === node.col - 1);
            if (prevNodeInRow && (node.available || !node.locked)) {
              connections.push({
                from: nodes.indexOf(prevNodeInRow),
                to: nodes.length - 1
              });
              connected = true;
            }
          }

          // Check if we should connect to nodes in the previous row
          if (rowIndex > 0 && !connected) {
            const prevRowNodes = nodes.filter(n => n.row === rowIndex - 1);

            // Connect to the closest node in the previous row
            if (prevRowNodes.length > 0) {
              let closestNode = prevRowNodes[0];
              let minDistance = Math.abs(closestNode.col - node.col);

              prevRowNodes.forEach(prevNode => {
                const distance = Math.abs(prevNode.col - node.col);
                if (distance < minDistance) {
                  minDistance = distance;
                  closestNode = prevNode;
                }
              });

              connections.push({
                from: nodes.indexOf(closestNode),
                to: nodes.length - 1
              });
            }
          }
        }
      });
    });

    // Add connections to nodes
    connections.forEach(conn => {
      const fromNode = nodes[conn.from];
      const toNode = nodes[conn.to];

      fromNode.connections.push({
        to: conn.to,
        x: toNode.x,
        y: toNode.y
      });
    });

    return nodes;
  };


  const nodes = generateSkillTree();

  // Handle node click
  const handleNodeClick = (node, event) => {
    if (node.locked) return;

    setSelectedNode(node);

    // Set submenu content based on node type
    if (node.type === 'topic') {
      const topic = curriculum.topics.find(t => t.id === node.id);
      if (topic) {
        setSubMenuContent({
          title: topic.name,
          items: topic.questions.map(qId => {
            const question = curriculum.questions.find(q => q.id === qId);
            return {
              id: qId,
              title: question ? question.title : `Question ${qId}`,
              completed: completedQuestions.includes(qId)
            };
          })
        });
        onTopicSelect(topic);
      }
    } else if (node.type === 'question') {
      const question = curriculum.questions.find(q => q.id === node.id);
      if (question) {
        setSubMenuContent({
          title: question.title,
          description: question.description,
          points: question.points
        });

        // First select the parent topic
        const topic = curriculum.topics.find(t => t.id === node.topicId);
        if (topic) onTopicSelect(topic);

        // Then select the question
        onQuestionSelect(node.id);
      }
    }

    // Position submenu near the clicked node
    const nodeRect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    setSubMenuPosition({
      x: nodeRect.left - containerRect.left + 40,
      y: nodeRect.top - containerRect.top + 40
    });

    setShowSubMenu(true);
  };

  // Generate SVG defs for filters and patterns
  const svgDefs = (
    <defs>
      {/* Rugged texture overlay */}
      <filter id="noise" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="G"/>
      </filter>

      {/* Canvas texture for background */}
      <pattern id="canvasTexture" patternUnits="userSpaceOnUse" width="200" height="200">
        <image href="data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E" width="200" height="200" />
      </pattern>

      {/* Active node gradient */}
      <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0ad4e"/>
        <stop offset="100%" stopColor="#d9534f"/>
      </linearGradient>

      {/* Available node gradient */}
      <linearGradient id="availableGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd27d"/>
        <stop offset="100%" stopColor="#ffb347"/>
      </linearGradient>

      {/* Completed node gradient */}
      <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5cb85c"/>
        <stop offset="100%" stopColor="#449d44"/>
      </linearGradient>

      {/* Locked node gradient */}
      <linearGradient id="lockedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#777777"/>
        <stop offset="100%" stopColor="#555555"/>
      </linearGradient>

      {/* Inner shadow for depth */}
      <filter id="innerShadow">
        <feOffset dx="0" dy="1"/>
        <feGaussianBlur stdDeviation="1" result="offset-blur"/>
        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
        <feFlood floodColor="black" floodOpacity="0.4" result="color"/>
        <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
        <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
      </filter>
    </defs>
  );

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      {/* Rugged textured background */}
      <div
        className="absolute inset-0 z-0 bg-stone-800"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      ></div>

      {/* Skill tree SVG */}
      <svg
        ref={svgRef}
        className="w-full h-full z-10 relative"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        {svgDefs}

        {/* Background pattern */}
        <rect width="100%" height="100%" fill="url(#canvasTexture)" opacity="0.6" />

        {/* Draw connections between nodes with simplified styling */}
        <g className="connections">
          {nodes.map((node, i) => (
            node.connections.map((conn, j) => {
              const targetNode = nodes[conn.to];
              if (!targetNode) return null;

              const isActive =
                (node.id === selectedNode?.id || targetNode.id === selectedNode?.id) ||
                (node.type === 'topic' && selectedTopic && node.id === selectedTopic.id) ||
                (node.type === 'question' && selectedQuestion && node.id === selectedQuestion.id) ||
                (targetNode.type === 'topic' && selectedTopic && targetNode.id === selectedTopic.id) ||
                (targetNode.type === 'question' && selectedQuestion && targetNode.id === selectedQuestion.id);

              const isLocked = node.locked || targetNode.locked;

              const isCompleted =
                (node.type === 'question' && completedQuestions.includes(node.id)) &&
                (targetNode.type === 'question' && completedQuestions.includes(targetNode.id));

              // Calculate midpoint for straight lines
              const dx = targetNode.x - node.x;
              const dy = targetNode.y - node.y;

              return (
                <path
                  key={`conn-${i}-${j}`}
                  className="connection-line"
                  d={`M ${node.x} ${node.y} L ${targetNode.x} ${targetNode.y}`}
                  fill="none"
                  stroke={isLocked ? '#555' : isActive ? '#d9534f' : isCompleted ? '#5cb85c' : '#ffd27d'}
                  strokeWidth={isActive ? 3 : 2}
                  strokeDasharray={isLocked ? "6,4" : "none"}
                  strokeLinecap="round"
                  style={{
                    filter: isActive ? 'drop-shadow(0 0 3px rgba(217, 83, 79, 0.6))' : 'none',
                    transition: 'stroke 0.3s ease'
                  }}
                />
              );
            })
          ))}
        </g>

        {/* Draw hexagonal nodes */}
        <g className="nodes">
          {nodes.map((node, i) => {
            // Calculate hexagon size
            const size = node.type === 'topic' ? 30 : 26;

            // Check if node is completed
            const isCompleted =
              node.type === 'question' && completedQuestions.includes(node.id);

            // Check if node is active (selected)
            const isActive =
              node.id === selectedNode?.id ||
              (node.type === 'topic' && selectedTopic && node.id === selectedTopic.id) ||
              (node.type === 'question' && selectedQuestion && node.id === selectedQuestion.id);

            // Hexagon points
            const points = `
              ${node.x},${node.y - size}
              ${node.x + size * 0.866},${node.y - size * 0.5}
              ${node.x + size * 0.866},${node.y + size * 0.5}
              ${node.x},${node.y + size}
              ${node.x - size * 0.866},${node.y + size * 0.5}
              ${node.x - size * 0.866},${node.y - size * 0.5}
            `;

            // Get fill color based on node state
            const fill = node.locked ? 'url(#lockedGradient)' :
                         isActive ? 'url(#activeGradient)' :
                         isCompleted ? 'url(#completedGradient)' :
                         'url(#availableGradient)';

            // Get stroke color based on node state
            const stroke = node.locked ? '#555' :
                           isActive ? '#d9534f' :
                           isCompleted ? '#5cb85c' :
                           '#ffd27d';

            return (
              <g
                key={`node-${i}`}
                className={`hex-node ${node.locked ? 'locked' : ''} ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={(e) => handleNodeClick(node, e)}
                style={{ cursor: node.locked ? 'not-allowed' : 'pointer' }}
              >
                {/* Hexagon background shadow */}
                <polygon
                  points={points}
                  fill="#000"
                  opacity="0.3"
                  transform="translate(2, 2)"
                />

                {/* Hexagon shape */}
                <polygon
                  points={points}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="2"
                  style={{
                    filter: 'url(#innerShadow)',
                    transition: 'fill 0.3s ease, stroke 0.3s ease'
                  }}
                />

                {/* Node content */}
                {node.locked ? (
                  <g transform={`translate(${node.x - 8}, ${node.y - 8})`}>
                    <rect width="16" height="16" fill="none"/>
                    <path
                      d="M4,8 L4,6 C4,3.8 5.8,2 8,2 C10.2,2 12,3.8 12,6 L12,8 L13,8 L13,14 L3,14 L3,8 L4,8 Z M9.8,8 L9.8,6 C9.8,5 9,4.2 8,4.2 C7,4.2 6.2,5 6.2,6 L6.2,8 L9.8,8 Z"
                      fill="#fff"
                    />
                  </g>
                ) : (
                  <>
                    {/* Node icon based on type */}
                    {node.type === 'topic' ? (
                      <g transform={`translate(${node.x - 12}, ${node.y - 12})`}>
                        <rect width="24" height="24" fill="none"/>
                        <path
                          d="M20,6 L12,13 L4,6 L4,18 L20,18 L20,6 Z M20,4 L4,4 C2.9,4 2,4.9 2,6 L2,18 C2,19.1 2.9,20 4,20 L20,20 C21.1,20 22,19.1 22,18 L22,6 C22,4.9 21.1,4 20,4 Z"
                          fill="#fff"
                        />
                      </g>
                    ) : (
                      <g transform={`translate(${node.x - 12}, ${node.y - 12})`}>
                        <rect width="24" height="24" fill="none"/>
                        <path
                          d="M9,16.2 L4.8,12 L3.4,13.4 L9,19 L21,7 L19.6,5.6 L9,16.2 Z"
                          fill={isCompleted ? "#fff" : "#fff7d6"}
                        />
                      </g>
                    )}

                    {/* Small numeric indicator */}
                    <circle
                      cx={node.x + size * 0.6}
                      cy={node.y - size * 0.6}
                      r="12"
                      fill="#e74c3c"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                    <text
                      x={node.x + size * 0.6}
                      y={node.y - size * 0.6 + 4}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {node.id}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Submenu panel for node details */}
      {showSubMenu && subMenuContent && (
        <div
          className="skill-submenu absolute z-20 bg-stone-700 border border-stone-500 rounded-md shadow-lg p-4 w-64"
          style={{
            left: subMenuPosition.x,
            top: subMenuPosition.y,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
          }}
        >
          <h3 className="text-amber-300 font-bold mb-2">{subMenuContent.title}</h3>

          {subMenuContent.description && (
            <p className="text-gray-300 text-sm mb-3">{subMenuContent.description}</p>
          )}

          {subMenuContent.points && (
            <div className="bg-amber-700 bg-opacity-30 rounded px-2 py-1 mb-3">
              <span className="text-amber-300 text-sm font-medium">{subMenuContent.points} points</span>
            </div>
          )}

          {subMenuContent.items && subMenuContent.items.length > 0 && (
            <ul className="space-y-2">
              {subMenuContent.items.map(item => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-stone-800 bg-opacity-50 rounded-sm p-2 cursor-pointer hover:bg-stone-600"
                  onClick={() => {
                    onQuestionSelect(item.id);
                    setShowSubMenu(false);
                  }}
                >
                  <span className="text-gray-200 text-sm">{item.title || `Question ${item.id}`}</span>
                  {item.completed && (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          )}

          <button
            className="absolute top-2 right-2 text-stone-400 hover:text-white"
            onClick={() => setShowSubMenu(false)}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      )}

      {/* Skill tree legend */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-stone-800 bg-opacity-80 p-3 rounded-lg flex space-x-6 border border-stone-600 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
          <span className="text-white">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span className="text-white">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-amber-400 mr-2"></div>
          <span className="text-white">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
          <span className="text-white">Locked</span>
        </div>
      </div>
    </div>
  );
};

// Main CurriculumPage Component
const CurriculumPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showQuestionsPanel, setShowQuestionsPanel] = useState(false);
  const [topicExpanded, setTopicExpanded] = useState({});
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
  };

  if (isLoading) {
    return <LanguageLoadingAnimation languageId={languageId} />;
  }

  return (
    <div className="min-h-screen bg-stone-800 py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
      }}
    >
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900/30 to-amber-900/10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 relative z-80">
          <div className="flex items-center">
            <Logo />
            <h1 className="ml-4 text-3xl font-bold text-amber-300">CodeQuest</h1>
          </div>
          <nav className="flex items-center">
            <div className="relative mr-4">
              <button
                onClick={() => setShowQuestionsPanel(!showQuestionsPanel)}
                className="bg-amber-700 hover:bg-amber-800 transition-colors text-white px-4 py-2 rounded-lg flex items-center border border-amber-600"
              >
                <span className="mr-2">Skill Tree</span>
                <FaChevronDown className={`transform transition-transform ${showQuestionsPanel ? 'rotate-180' : ''}`} />
              </button>

              {/* New Hexagonal Skill Tree Panel */}
              {showQuestionsPanel && (
                <>
                  {/* Backdrop blur overlay */}
                  <div
                    className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-[9990]"
                    onClick={() => setShowQuestionsPanel(false)}
                  ></div>

                  {/* Enhanced Skill Tree Panel */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed inset-4 rounded-xl shadow-2xl z-[9999] overflow-hidden flex flex-col border border-stone-600"
                    style={{
                      background: 'linear-gradient(135deg, rgba(41,37,36,0.95) 0%, rgba(28,25,23,0.98) 100%)',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
                    }}
                  >
                    <div
                      className="p-4 flex justify-between items-center"
                      style={{
                        background: 'linear-gradient(to right, rgba(120,53,15,0.9) 0%, rgba(146,64,14,0.7) 100%)',
                        borderBottom: '1px solid rgba(180,83,9,0.5)',
                      }}
                    >
                      <h3 className="text-2xl font-bold text-white flex items-center">
                        <FaStar className="mr-2 text-amber-300" />
                        <span>CodeQuest Skill Tree</span>
                      </h3>
                      <button
                        onClick={() => setShowQuestionsPanel(false)}
                        className="text-amber-200 hover:text-white p-2 rounded-full hover:bg-amber-800/50 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex-grow">
                      {/* Dynamic skill tree content */}
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
                        background: 'linear-gradient(to right, rgba(120,53,15,0.9) 0%, rgba(146,64,14,0.7) 100%)',
                        borderTop: '1px solid rgba(180,83,9,0.5)',
                      }}
                    >
                      <div className="flex items-center">
                        <div className="mr-4 flex items-center bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 px-4 py-1.5 rounded-full shadow-lg border border-amber-300">
                          <FaStar className="mr-2" />
                          <span className="font-bold text-lg">{score}</span>
                        </div>
                        <p className="text-amber-200 text-sm">
                          Unlock new skills with points earned from challenges!
                        </p>
                      </div>
                      <button
                        onClick={() => setShowQuestionsPanel(false)}
                        className="bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium px-4 py-2 rounded-lg shadow-lg transition-all border border-amber-500"
                      >
                        Return to Quest
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            <div className="mr-4 flex items-center bg-amber-500 text-amber-900 px-3 py-1 rounded-full border border-amber-400">
              <FaStar className="mr-1" />
              <span className="font-bold">{score}</span>
            </div>
            <button className="text-amber-300 hover:text-amber-200 transition-colors font-medium px-4 py-2 rounded-lg">
              Profile
            </button>
          </nav>
        </header>

        {/* Main content area */}
        <main className="flex flex-row relative z-10 h-[calc(100vh-180px)] gap-6">
          {/* Left panel - 33% width */}
          <div className="w-1/3 overflow-y-auto rounded-xl">
            {selectedQuestion ? (
              <div className="bg-stone-900/80 p-6 rounded-xl shadow-lg h-full border border-stone-700"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
                }}
              >
                <div className="bg-stone-800/80 p-4 rounded-lg mb-6 border border-stone-700">
                  <h3 className="text-2xl font-bold text-amber-300">
                    {selectedQuestion.title}
                  </h3>
                  <div className="flex items-center mt-3 flex-wrap gap-2">
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-amber-400">
                      {selectedQuestion.points} POINTS
                    </span>
                    <span className="bg-stone-700/70 text-gray-200 text-xs px-3 py-1.5 rounded-full border border-stone-600">
                      {selectedTopic?.name}
                    </span>
                    {/* Status tag */}
                    <span className={`text-xs px-3 py-1.5 rounded-full shadow-sm border ${
                      completedQuestions.includes(selectedQuestion.id)
                        ? 'bg-green-700/50 text-white border-green-600'
                        : feedback && feedback.type === 'success'
                          ? 'bg-amber-600/50 text-white border-amber-500'
                          : 'bg-stone-700/70 text-gray-300 border-stone-600'
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
                <div className="bg-stone-800/50 rounded-lg p-5 shadow-inner border border-stone-700">
                  <h4 className="text-sm font-medium text-amber-200 mb-3 flex items-center">
                    <FaChevronRight className="mr-2 text-xs text-amber-400" />
                    Problem Description
                  </h4>
                  <div className="text-gray-200 space-y-4 leading-relaxed">
                    <p>{selectedQuestion.description}</p>
                  </div>

                  {/* Example section */}
                  <div className="mt-6 pt-4 border-t border-stone-700">
                    <h4 className="text-sm font-medium text-amber-200 mb-3 flex items-center">
                      <FaChevronRight className="mr-2 text-xs text-amber-400" />
                      Example
                    </h4>
                    <div className="bg-stone-900/70 rounded-lg p-3 font-mono text-sm text-gray-300 border border-stone-700">
                      <p className="mb-2 text-amber-400">Input:</p>
                      <pre className="mb-4">["hello", "world"]</pre>
                      <p className="mb-2 text-amber-400">Output:</p>
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
                  className="text-center p-8 bg-stone-900/70 rounded-xl max-w-xl shadow-lg border border-stone-700"
                >
                  <div className="text-6xl mb-6">🚀</div>
                  <h3 className="text-3xl font-bold text-amber-300 mb-4">
                    Ready to start coding?
                  </h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    Select a question from the skill tree to begin your coding journey
                  </p>
                  <button
                    onClick={() => setShowQuestionsPanel(true)}
                    className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all flex items-center mx-auto border border-amber-500"
                  >
                    <span className="mr-2">Open Skill Tree</span>
                    <FaChevronRight />
                  </button>
                </motion.div>
              </div>
            )}
          </div>

          {/* Right panel - 67% width */}
          <div className="w-2/3 flex flex-col overflow-hidden rounded-xl shadow-xl bg-stone-900/90 border border-stone-700">
            {selectedQuestion ? (
              <>
                {/* Code Editor Header with Run and Submit buttons */}
                <div className="bg-stone-800 text-white p-4 flex justify-between items-center border-b border-stone-700 rounded-t-xl">
                  <div className="flex space-x-2 items-center">
                    <button onClick={handleClearCode} className="p-2 hover:bg-stone-700 rounded-lg transition-colors" title="Clear Code">
                      <FaTrash />
                    </button>
                    <button className="p-2 hover:bg-stone-700 rounded-lg transition-colors" title="Undo">
                      <FaUndo />
                    </button>
                    <button className="p-2 hover:bg-stone-700 rounded-lg transition-colors" title="Redo">
                      <FaRedo />
                    </button>
                    <div className="text-sm text-gray-300 ml-3 flex items-center">
                      <span className="bg-stone-700 text-gray-200 text-xs px-3 py-1 rounded-full border border-stone-600">main.py</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={runCode}
                      className="bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:from-amber-700 hover:to-amber-800 transition duration-300 flex items-center border border-amber-500"
                      disabled={isExecuting}
                    >
                      <FaPlay className="mr-2" /> {isExecuting ? 'Running...' : 'Run Code'}
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:from-green-700 hover:to-green-800 transition duration-300 flex items-center border border-green-500"
                    >
                      <FaCheckCircle className="mr-2" /> Submit
                    </button>
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
                <div className="border-t border-stone-700 mt-auto">
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
              <div className="flex items-center justify-center h-full bg-stone-900/70 rounded-xl">
                <div className="text-center p-8">
                  <svg className="w-16 h-16 mx-auto mb-6 text-amber-500 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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