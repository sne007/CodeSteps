import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import {
    FaPlay,
    FaTrash,
    FaUndo,
    FaRedo,
    FaStar,
    FaLock,
    FaChevronDown,
    FaCheckCircle
} from 'react-icons/fa';
import { useCurriculum } from "./context/CurriculumContext";
import { animateStars } from "../utils/animateStars";
import LanguageLoadingAnimation from "./LanguageLoading";

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

    const handleCodeChange = (newCode) => {
        setCode(newCode);
    };

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <LanguageLoadingAnimation languageId={languageId} />
        );
    }

    const runCode = () => {
        setIsExecuting(true);
        setOutput(''); // Clear previous output

        // Create a custom console.log function
        const customLog = (...args) => {
            setOutput(prev => prev + args.join(' ') + '\n');
        };

        // Replace console.log in the user's code
        const modifiedCode = code.replace(/console\.log/g, 'customLog');

        try {
            // Use new Function to create a function from the modified code
            const execFunc = new Function('customLog', modifiedCode);
            execFunc(customLog);
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        }

        setIsExecuting(false);
    };

    const handleClearCode = () => {
        setCode('');
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

    const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
    };

    const handleQuestionSelect = (questionId) => {
        const question = curriculum.questions.find(q => q.id === questionId);
        setSelectedQuestion(question);
    };

    // Add more mock topics for testing scroll
    const mockTopics = [
        { id: 6, name: 'Advanced Data Structures', locked: true, questions: [] },
        { id: 7, name: 'Algorithms', locked: true, questions: [] },
        { id: 8, name: 'Web Development', locked: true, questions: [] },
        { id: 9, name: 'Database Management', locked: true, questions: [] },
        { id: 10, name: 'Machine Learning Basics', locked: true, questions: [] },
    ];

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

                <main className="flex space-x-8 relative z-10">
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

                    <div className="w-2/3">
                        {selectedQuestion && (
                            <div className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg">
                                <h3 className="text-2xl font-bold text-white mb-4">{selectedQuestion.title}</h3>
                                <p className="text-indigo-100 mb-4">{selectedQuestion.description}</p>
                                <div className="mb-4">
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
                                    <AceEditor
                                        mode="python"
                                        theme="monokai"
                                        onChange={handleCodeChange}
                                        name="code-editor"
                                        editorProps={{ $blockScrolling: true }}
                                        width="100%"
                                        height="200px"
                                        fontSize={14}
                                        showPrintMargin={false}
                                        showGutter={true}
                                        highlightActiveLine={true}
                                        value={code}
                                    />
                                </div>
                                <div className="mt-4 bg-gray-800 p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2 text-white">Output:</h4>
                                    <pre className="whitespace-pre-wrap text-green-400">{output}</pre>
                                </div>
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={runCode}
                                        className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center"
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
                                {feedback && (
                                    <div className={`mt-4 p-3 rounded-lg ${
                                        feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {feedback.message}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>

                <footer className="mt-16 text-center text-indigo-100">
                    <p>&copy; 2024 CodeQuest. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default CurriculumPage;