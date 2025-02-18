import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import { useCurriculum } from "./context/CurriculumContext";
import { animateStars } from "../utils/animateStars";
import LanguageLoadingAnimation from "./LanguageLoading";
import { FaPlay, FaTrash, FaUndo, FaRedo, FaStar, FaLock, FaChevronDown, FaCheckCircle,
         FaEdit, FaPlus, FaChevronRight, FaTimes, FaCog } from 'react-icons/fa';

const Logo = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


const TopicCard = ({ topic, onSelect, isSelected, completedQuestions, onQuestionSelect, selectedQuestion }) => {
  const [isExpanded, setIsExpanded] = useState(isSelected);
  const completedCount = topic.questions.filter(qId => completedQuestions.includes(qId)).length;
  const progress = (completedCount / topic.questions.length) * 100;

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    onSelect(topic);
  };

  return (
    <motion.div
      layout
      className={`bg-gradient-to-br ${isSelected ? 'from-indigo-600 to-indigo-800' : 'from-purple-500 to-indigo-600'}
                  rounded-xl shadow-lg overflow-hidden cursor-pointer relative mb-4 w-full`}
      onClick={handleClick}
      initial={false}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 }
      }}
    >
      <motion.div layout className="p-4">
        <motion.div layout className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">{topic.name}</h3>
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
        <motion.p layout className="text-xs text-yellow-100 mt-1">{completedCount}/{topic.questions.length} completed</motion.p>
      </motion.div>
      <AnimatePresence initial={false}>
        {isExpanded && (
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
                className={`p-3 m-2 rounded-md cursor-pointer transition-all duration-200 flex justify-between items-center relative overflow-hidden ${
                  completedQuestions.includes(questionId)
                    ? 'bg-green-500 bg-opacity-20'
                    : 'bg-indigo-400 bg-opacity-20'
                }`}
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
                }`}>Question {questionId}</p>
                {completedQuestions.includes(questionId) && (
                  <FaCheckCircle className="text-yellow-300 relative z-10" />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {topic.locked && (
        <div className="absolute top-2 right-2 text-yellow-300">
          <FaLock />
        </div>
      )}
    </motion.div>
  );
};

const TestCase = ({ test, result }) => (
  <div className="p-2 bg-test-case-bg rounded-lg border border-test-case-border flex items-center space-x-3">
    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-full">
      <span className="text-white font-medium">{test.id}</span>
    </div>
    <div className="flex-grow min-w-0">
      <p className="text-sm text-gray-300 truncate">{test.description}</p>
      <div className="flex items-center text-xs space-x-2 text-gray-400">
        <span>Expected:</span>
        <code className="bg-gray-700 px-1 py-0.5 rounded">{test.expected.trim()}</code>
      </div>
    </div>
    {result && (
      <div className={`flex-shrink-0 text-2xl ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
        {result.passed ? '✓' : '✗'}
      </div>
    )}
  </div>
);

const CurriculumPage = () => {
  const [isLoading, setIsLoading] = useState(true);
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

  const testCases = [
    { id: 1, description: "Should print 'Hello, World!'", expected: "Hello, World!\n" }
    // Additional test cases can be added here.
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleClearCode = () => {
    setCode('');
    outputRef.current = '';
    setOutput('');
    setFeedback(null);
  };

  const handleSubmit = () => {
    setFeedback({ type: 'success', message: 'Correct! Great job!' });
    if (selectedQuestion) {
      animateStars(selectedQuestion.points, setScore);
      completeQuestion(selectedQuestion.id);
    }
  };

  const runTestCases = async () => {
    const results = [];
    for (let test of testCases) {
      const result = await runUserCode();
      const passed = result.trim() === test.expected.trim();
      results.push({ id: test.id, passed, output: result });
    }
    setTestResults(results);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && event.shiftKey) {
      event.preventDefault();
    }
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleQuestionSelect = (questionId) => {
    const question = curriculum.questions.find(q => q.id === questionId);
    setSelectedQuestion(question);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <header className="flex justify-between items-center mb-12 relative z-10">
          <div className="flex items-center">
            <Logo />
            <h1 className="ml-4 text-4xl font-extrabold text-white">CodeQuest</h1>
          </div>
          <nav className="flex items-center">
            <div className="mr-4 flex items-center bg-yellow-400 text-purple-700 px-3 py-1 rounded-full">
              <FaStar className="mr-1" />
              <span className="font-bold">{score}</span>
            </div>
          </nav>
        </header>
        <main className="flex space-x-8 relative z-10 h-[calc(100vh-200px)]">
          <div className="w-1/3 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-4 pl-2 ml-2 custom-scrollbar">
            <h2 className="text-2xl font-extrabold text-white mb-4 pl-2 ml-2">
              {languageId.charAt(0).toUpperCase() + languageId.slice(1)} Topics
            </h2>
            <motion.div layout className="relative px-3 py-2">
              {curriculum && curriculum.topics.concat(mockTopics).map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onSelect={handleTopicSelect}
                  isSelected={selectedTopic && selectedTopic.id === topic.id}
                  completedQuestions={completedQuestions}
                  onQuestionSelect={handleQuestionSelect}
                  selectedQuestion={selectedQuestion}
                />
              ))}
            </motion.div>
          </div>
          <div className="w-2/3 overflow-y-auto">
            {selectedQuestion && (
              <div className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg h-full flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {selectedQuestion.title}
                </h3>
                <p className="text-indigo-100 mb-4">
                  {selectedQuestion.description}
                </p>

                <div className="flex-grow flex flex-col min-h-0">
                  <div className="bg-gray-800 text-white p-2 rounded-t-lg flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button onClick={runCode} className="p-1 hover:bg-gray-700 rounded" title="Run Code">
                        <FaPlay />
                      </button>
                      <button onClick={handleClearCode} className="p-1 hover:bg-gray-700 rounded" title="Clear Code">
                        <FaTrash />
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 hover:bg-gray-700 rounded" title="Undo">
                        <FaUndo />
                      </button>
                      <button className="p-1 hover:bg-gray-700 rounded" title="Redo">
                        <FaRedo />
                      </button>
                    </div>
                  </div>

                  <div className="flex-grow relative">
                    <AceEditor
                      mode="python"
                      theme="monokai"
                      onChange={setCode}
                      onKeyDown={handleKeyDown}
                      name="code-editor"
                      editorProps={{ $blockScrolling: true }}
                      width="100%"
                      height="100%"
                      fontSize={14}
                      showPrintMargin={false}
                      showGutter={true}
                      highlightActiveLine={true}
                      value={code}
                    />
                  </div>
                </div>

                <div className="mt-4 flex space-x-4">
                  <div className="flex-grow">
                    <div className="bg-gray-800 p-3 rounded-lg h-24 overflow-y-auto">
                      <h4 className="text-sm font-semibold text-gray-400 mb-1">Output:</h4>
                      <pre className="text-sm whitespace-pre-wrap text-green-400">{output}</pre>
                    </div>
                  </div>

                  <div className="w-1/3 flex flex-col space-y-2">
                    <button
                      onClick={runCode}
                      className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
                      disabled={isExecuting}
                    >
                      <FaPlay className="mr-2" /> {isExecuting ? 'Running...' : 'Run Code'}
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                    >
                      Submit Answer
                    </button>
                  </div>
                </div>

                <div className="mt-4 bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white">Test Cases</h4>
                    <button
                      onClick={runTestCases}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded transition"
                    >
                      Run Tests
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {testCases.map((test) => (
                      <TestCase
                        key={test.id}
                        test={test}
                        result={testResults.find(r => r.id === test.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <footer className="mt-8 text-center text-indigo-100">
          <p>© 2024 CodeQuest. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default CurriculumPage;