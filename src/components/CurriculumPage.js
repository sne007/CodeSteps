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
  <div className="p-3 bg-gray-800 bg-opacity-40 rounded-lg border border-gray-700 flex items-center space-x-3 transition-all hover:bg-opacity-60">
    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-full">
      <span className="text-white font-medium">{test.id}</span>
    </div>
    <div className="flex-grow min-w-0">
      <p className="text-sm text-gray-300">{test.description}</p>
      <div className="flex items-center text-xs space-x-2 text-gray-400 mt-1">
        <span>Expected:</span>
        <code className="bg-gray-700 px-2 py-1 rounded">{test.expected.trim()}</code>
      </div>
    </div>
    {result && (
      <div className={`flex-shrink-0 text-2xl ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
        {result.passed ? '✓' : '✗'}
      </div>
    )}
  </div>
);

// Component for topic cards in the sidebar
const TopicCard = ({ topic, onSelect, isSelected, completedQuestions, onQuestionSelect, selectedQuestion }) => {
  const [isExpanded, setIsExpanded] = useState(isSelected);
  const completedCount = topic.questions.filter(qId => completedQuestions.includes(qId)).length;
  const progress = (completedCount / topic.questions.length) * 100;

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
        ${topic.locked ? 'from-gray-500 to-gray-700 opacity-80' : isSelected ? 'from-indigo-600 to-indigo-800' : 'from-purple-500 to-indigo-600'}
        bg-gradient-to-br rounded-xl shadow-lg overflow-hidden cursor-pointer relative mb-4 w-full transition-all
      `}
      onClick={handleClick}
      initial={false}
      whileHover={!topic.locked ? {
        scale: 1.02,
        boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 }
      } : {}}
    >
      <motion.div layout className="p-4">
        <motion.div layout className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center">
            {topic.locked && <FaLock className="mr-2 text-yellow-300" />}
            {topic.name}
          </h3>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronDown className="text-yellow-300" />
          </motion.div>
        </motion.div>

        <motion.div layout className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-2">
          <motion.div
            className="bg-yellow-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.p layout className="text-xs text-yellow-100 mt-1">
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
            className="bg-indigo-700 bg-opacity-50 backdrop-blur-sm overflow-hidden"
          >
            {topic.questions.map((questionId) => (
              <motion.div
                key={questionId}
                className={`
                  p-3 m-2 rounded-md cursor-pointer transition-all duration-200
                  flex justify-between items-center relative overflow-hidden
                  ${completedQuestions.includes(questionId)
                    ? 'bg-green-500 bg-opacity-20'
                    : 'bg-indigo-400 bg-opacity-20'}
                `}
                whileHover={{
                  backgroundColor: 'rgba(250, 204, 21, 0.3)',
                  transition: { duration: 0.1 }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onQuestionSelect(questionId);
                }}
              >
                {selectedQuestion && selectedQuestion.id === questionId && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-300"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                <p className={`text-sm font-medium relative z-10 ${
                  selectedQuestion && selectedQuestion.id === questionId
                    ? 'text-yellow-300'
                    : 'text-white'
                }`}>
                  Question {questionId}
                </p>
                {completedQuestions.includes(questionId) && (
                  <FaCheckCircle className="text-yellow-300 relative z-10" />
                )}
              </motion.div>
            ))}
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
    <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
      {/* Tabs Header */}
      <div className="flex border-b border-indigo-500/30">
        <button
          onClick={() => setActiveTab('console')}
          className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${
            activeTab === 'console'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${activeTab === 'console' ? 'text-yellow-300' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Console
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${
            activeTab === 'tests'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <FaChevronRight className={`mr-2 ${activeTab === 'tests' ? 'text-yellow-300' : ''}`} />
          Test Cases
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${
            activeTab === 'results'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <FaCheckCircle className={`mr-2 ${activeTab === 'results' ? 'text-yellow-300' : ''}`} />
          Results {testResults.length > 0 && `(${testResults.filter(r => r.passed).length}/${testResults.length})`}
        </button>

        <button
          onClick={() => setActiveTab('hints')}
          className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${
            activeTab === 'hints'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <FaStar className={`mr-2 ${activeTab === 'hints' ? 'text-yellow-300' : ''}`} />
          Hints
        </button>

        <div className="ml-auto pr-4 py-2">
          {activeTab === 'console' ? (
            <button
              onClick={clearOutput}
              className="bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded transition-colors"
            >
              Clear Console
            </button>
          ) : activeTab === 'tests' || activeTab === 'results' ? (
            <button
              onClick={runTestCases}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded transition-colors flex items-center"
            >
              <FaPlay className="mr-1" /> Run Tests
            </button>
          ) : null}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'console' && (
          <div className="h-48 overflow-y-auto bg-gray-900/80 backdrop-blur-sm text-green-400 font-mono text-sm p-4 rounded-xl border border-gray-700/50 shadow-inner">
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
                  <div className="flex-1 bg-gray-700 h-2 rounded-full overflow-hidden">
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
                    <div key={result.id} className={`p-4 rounded-lg ${result.passed ? 'bg-green-900 bg-opacity-20' : 'bg-red-900 bg-opacity-20'}`}>
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
                        <div className="mt-3 pt-3 border-t border-red-800 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-400 mb-1">Expected:</p>
                              <pre className="bg-gray-800 p-2 rounded text-green-300 text-xs overflow-x-auto">{test?.expected}</pre>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-1">Actual:</p>
                              <pre className="bg-gray-800 p-2 rounded text-red-300 text-xs overflow-x-auto">{result.output}</pre>
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
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
                >
                  Run Tests Now
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hints' && (
          <div className="space-y-4 text-gray-300">
            <div className="bg-indigo-800 bg-opacity-30 rounded-lg p-4 border-l-4 border-yellow-400">
              <h4 className="font-medium text-yellow-300 mb-2">Hint 1:</h4>
              <p>Remember to check your syntax carefully. In Python, proper indentation is crucial.</p>
            </div>
            <div className="bg-indigo-800 bg-opacity-30 rounded-lg p-4 border-l-4 border-yellow-400">
              <h4 className="font-medium text-yellow-300 mb-2">Hint 2:</h4>
              <p>Try breaking down the problem into smaller steps. What's the first thing you need to do?</p>
            </div>
            <div className="text-center mt-6">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-medium py-2 px-4 rounded-lg transition-colors">
                Reveal Solution (Costs 5 Points)
              </button>
            </div>
          </div>
        )}
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

  // Mock topics for display
  const mockTopics = [
    { id: 6, name: 'Advanced Data Structures', locked: true, questions: [] },
    { id: 7, name: 'Algorithms', locked: true, questions: [] },
    { id: 8, name: 'Web Development', locked: true, questions: [] },
    { id: 9, name: 'Database Management', locked: true, questions: [] },
    { id: 10, name: 'Machine Learning Basics', locked: true, questions: [] },
  ];

  if (isLoading) {
    return <LanguageLoadingAnimation languageId={languageId} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background light effects */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/20 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iMC41IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIi8+PC9zdmc+')] opacity-50 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-yellow-500/10 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-blue-500/10 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 relative z-80">
          <div className="flex items-center">
            <Logo />
            <h1 className="ml-4 text-4xl font-extrabold text-white">CodeQuest</h1>
          </div>
          <nav className="flex items-center">
            <div className="relative mr-4">
              <button
                onClick={() => setShowQuestionsPanel(!showQuestionsPanel)}
                className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white px-4 py-2 rounded-lg flex items-center"
              >
                <span className="mr-2">Questions</span>
                <FaChevronDown className={`transform transition-transform ${showQuestionsPanel ? 'rotate-180' : ''}`} />
              </button>

              {/* Questions Panel */}
              {showQuestionsPanel && (
                <>
                  {/* Backdrop blur overlay with increased z-index */}
                  <div
                    className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-80"
                    onClick={() => setShowQuestionsPanel(false)}
                  ></div>

                  {/* Panel with increased z-index */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto bg-gray-900 bg-opacity-95 backdrop-blur-lg rounded-xl shadow-xl z-[9999]"
                  >
                    <div className="sticky top-0 bg-indigo-900 bg-opacity-90 backdrop-blur-md p-3 border-b border-indigo-700">
                      <h3 className="text-lg font-bold text-white flex justify-between items-center">
                        <span>Topics & Questions</span>
                        <button
                          onClick={() => setShowQuestionsPanel(false)}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </h3>
                    </div>

                    <div className="p-3">
                      {curriculum && curriculum.topics.concat(mockTopics).map((topic) => (
                        <div key={topic.id} className="mb-4">
                          <div
                            className={`
                              ${topic.locked ? 'bg-gray-700 text-gray-300' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'}
                              p-3 rounded-lg cursor-pointer ${topic.locked && 'opacity-70'} relative overflow-hidden
                            `}
                            onClick={() => {
                              if (!topic.locked) {
                                const isCurrentlySelected = selectedTopic && selectedTopic.id === topic.id;
                                setTopicExpanded(prevState => ({
                                  ...prevState,
                                  [topic.id]: isCurrentlySelected ? !prevState[topic.id] : true
                                }));
                                if (!isCurrentlySelected) {
                                  setSelectedTopic(topic);
                                }
                              }
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium flex items-center">
                                {topic.locked && <FaLock className="mr-2 text-yellow-300" />}
                                {topic.name}
                              </h4>
                              {!topic.locked && (
                                <FaChevronDown
                                  className={`transform transition-transform ${topicExpanded[topic.id] ? 'rotate-180' : ''} text-yellow-300`}
                                />
                              )}
                            </div>

                            {!topic.locked && (
                              <div className="mt-2">
                                <div className="w-full bg-white bg-opacity-30 rounded-full h-1.5">
                                  <div
                                    className="bg-yellow-400 h-1.5 rounded-full"
                                    style={{
                                      width: `${(topic.questions.filter(qId => completedQuestions.includes(qId)).length / topic.questions.length) * 100}%`
                                    }}
                                  ></div>
                                </div>
                                <p className="text-xs mt-1 text-indigo-200">
                                  {topic.questions.filter(qId => completedQuestions.includes(qId)).length}/{topic.questions.length} completed
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Questions List */}
                          {!topic.locked && topicExpanded[topic.id] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-3 mt-2 space-y-2"
                            >
                              {topic.questions.map((questionId) => (
                                <motion.div
                                  key={questionId}
                                  className={`
                                    p-2 rounded border-l-2 cursor-pointer
                                    ${selectedQuestion && selectedQuestion.id === questionId
                                      ? 'bg-yellow-500 bg-opacity-20 border-yellow-400 text-yellow-300'
                                      : completedQuestions.includes(questionId)
                                        ? 'bg-green-500 bg-opacity-10 border-green-400 text-green-300'
                                        : 'bg-indigo-500 bg-opacity-10 border-indigo-400 text-white'
                                    }
                                  `}
                                  whileHover={{
                                    x: 3,
                                    transition: { duration: 0.1 }
                                  }}
                                  onClick={() => {
                                    const question = curriculum.questions.find(q => q.id === questionId);
                                    setSelectedQuestion(question);
                                    setShowQuestionsPanel(false);
                                  }}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm">Question {questionId}</span>
                                    {completedQuestions.includes(questionId) && (
                                      <FaCheckCircle className="text-green-400 text-sm" />
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            <div className="mr-4 flex items-center bg-yellow-400 text-purple-700 px-3 py-1 rounded-full">
              <FaStar className="mr-1" />
              <span className="font-bold">{score}</span>
            </div>
            <button className="text-white hover:text-yellow-300 transition-colors font-bold px-4 py-2 rounded-lg">
              Profile
            </button>
          </nav>
        </header>

        {/* Main content area - UPDATED TO LEFT-RIGHT SPLIT WITH IMPROVED STYLING */}
        <main className="flex flex-row relative z-10 h-[calc(100vh-200px)] gap-6">
          {/* Left panel - 33% width */}
          <div className="w-1/3 overflow-y-auto rounded-2xl">
            {selectedQuestion ? (
              <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-md p-6 rounded-2xl shadow-lg h-full">
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl mb-6 border border-indigo-400/20">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedQuestion.title}
                  </h3>
                  <div className="flex items-center mt-3 flex-wrap gap-2">
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {selectedQuestion.points} POINTS
                    </span>
                    <span className="bg-indigo-600/40 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm border border-indigo-500/30">
                      {selectedTopic?.name}
                    </span>
                    {/* Status tag */}
                    <span className={`text-xs px-3 py-1.5 rounded-full shadow-sm ${
                      completedQuestions.includes(selectedQuestion.id)
                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                        : feedback && feedback.type === 'success'
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900'
                          : 'bg-gray-700/70 text-gray-300 border border-gray-600/50'
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
                <div className="bg-indigo-800/20 backdrop-blur-sm rounded-xl p-5 shadow-inner border border-indigo-500/20">
                  <h4 className="text-sm font-medium text-indigo-200 mb-3 flex items-center">
                    <FaChevronRight className="mr-2 text-xs text-yellow-300" />
                    Problem Description
                  </h4>
                  <div className="text-white space-y-4 leading-relaxed">
                    <p>{selectedQuestion.description}</p>
                  </div>

                  {/* Example section */}
                  <div className="mt-6 pt-4 border-t border-indigo-500/30">
                    <h4 className="text-sm font-medium text-indigo-200 mb-3 flex items-center">
                      <FaChevronRight className="mr-2 text-xs text-yellow-300" />
                      Example
                    </h4>
                    <div className="bg-indigo-900/50 rounded-lg p-3 font-mono text-sm text-indigo-200">
                      <p className="mb-2 text-yellow-300">Input:</p>
                      <pre className="mb-4">["hello", "world"]</pre>
                      <p className="mb-2 text-yellow-300">Output:</p>
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
                  className="text-center p-8 bg-indigo-900/30 backdrop-blur-lg rounded-2xl max-w-xl shadow-lg border border-indigo-500/20"
                >
                  <div className="text-6xl mb-6">🚀</div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Ready to start coding?
                  </h3>
                  <p className="text-indigo-100 mb-8 text-lg">
                    Select a question from the topics to begin your coding journey
                  </p>
                  <button
                    onClick={() => setShowQuestionsPanel(true)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all hover:scale-105 flex items-center mx-auto"
                  >
                    <span className="mr-2">Browse Questions</span>
                    <FaChevronRight />
                  </button>
                </motion.div>
              </div>
            )}
          </div>

          {/* Right panel - 67% width */}
          <div className="w-2/3 flex flex-col overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-gray-900/90 to-indigo-900/90 backdrop-blur-md border border-indigo-500/20">
            {selectedQuestion ? (
              <>
                {/* Code Editor Header with Run and Submit buttons */}
                <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 text-white p-4 flex justify-between items-center border-b border-indigo-500/30 rounded-t-2xl backdrop-blur-sm">
                  <div className="flex space-x-2 items-center">
                    <button onClick={handleClearCode} className="p-2 hover:bg-indigo-600/30 rounded-lg transition-colors" title="Clear Code">
                      <FaTrash />
                    </button>
                    <button className="p-2 hover:bg-indigo-600/30 rounded-lg transition-colors" title="Undo">
                      <FaUndo />
                    </button>
                    <button className="p-2 hover:bg-indigo-600/30 rounded-lg transition-colors" title="Redo">
                      <FaRedo />
                    </button>
                    <div className="text-sm text-gray-300 ml-3 flex items-center">
                      <span className="bg-indigo-600/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">main.py</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={runCode}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-700 transition duration-300 flex items-center"
                      disabled={isExecuting}
                    >
                      <FaPlay className="mr-2" /> {isExecuting ? 'Running...' : 'Run Code'}
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition duration-300 flex items-center"
                    >
                      <FaCheckCircle className="mr-2" /> Submit
                    </button>
                  </div>
                </div>

                {/* Code Editor - explicit height to ensure proper stacking */}
                <div className="relative flex-grow rounded-bl-2xl rounded-br-2xl overflow-hidden">
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
                <div className="border-t border-indigo-500/30 mt-auto">
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
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900/50 to-indigo-900/50 rounded-2xl backdrop-blur-sm">
                <div className="text-center p-8">
                  <svg className="w-16 h-16 mx-auto mb-6 text-indigo-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <footer className="mt-8 text-center text-indigo-100 relative z-10">
          <p>© 2024 CodeQuest. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default CurriculumPage;