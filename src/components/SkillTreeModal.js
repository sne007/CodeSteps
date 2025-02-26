import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaStar, FaLock, FaCheckCircle, FaRocket, FaCode, FaChevronRight
} from 'react-icons/fa';
import { RiSwordFill, RiShieldFill } from 'react-icons/ri';
import { GiCrystalBall } from 'react-icons/gi';

const SkillTreeModal = ({
  show,
  onClose,
  curriculum,
  completedQuestions,
  onTopicSelect,
  onQuestionSelect,
  selectedTopic,
  selectedQuestion,
  score
}) => {
  const [expandedNodeId, setExpandedNodeId] = useState(null);

  if (!show || !curriculum) return null;

  // Calculate completion percentages for each topic
  const topicProgress = curriculum.topics.reduce((acc, topic) => {
    const completedCount = topic.questions.filter(qId => completedQuestions.includes(qId)).length;
    const total = topic.questions.length;
    acc[topic.id] = {
      percent: total ? (completedCount / total) * 100 : 0,
      completed: completedCount,
      total
    };
    return acc;
  }, {});

  // Function to check if a topic is unlocked based on prerequisites
  const isTopicUnlocked = (topic) => {
    if (!topic.locked) return true;

    // Simple logic - previous topic must be at least 50% complete
    if (topic.id > 1) {
      return topicProgress[topic.id - 1]?.percent >= 50;
    }

    return false;
  };

  // Get status of a node (locked, unlocked, completed, etc.)
  const getNodeStatus = (topic) => {
    if (!isTopicUnlocked(topic)) return "locked";
    if (topicProgress[topic.id]?.percent === 100) return "mastered";
    if (topicProgress[topic.id]?.percent >= 75) return "advanced";
    if (topicProgress[topic.id]?.percent >= 25) return "intermediate";
    if (topicProgress[topic.id]?.percent > 0) return "started";
    return "unlocked";
  };

  // Map of status to colors and icons
  const statusConfig = {
    locked: {
      bgClass: "from-slate-700 to-slate-800",
      borderClass: "border-slate-600",
      icon: <FaLock className="text-slate-400" />,
      pathClass: "stroke-slate-700",
      glowColor: "rgba(100, 116, 139, 0.2)"
    },
    unlocked: {
      bgClass: "from-cyan-800 to-cyan-900",
      borderClass: "border-cyan-700",
      icon: <FaCode className="text-cyan-400" />,
      pathClass: "stroke-cyan-700",
      glowColor: "rgba(8, 145, 178, 0.2)"
    },
    started: {
      bgClass: "from-cyan-600 to-cyan-800",
      borderClass: "border-cyan-500",
      icon: <FaRocket className="text-cyan-300" />,
      pathClass: "stroke-cyan-600",
      glowColor: "rgba(6, 182, 212, 0.4)"
    },
    intermediate: {
      bgClass: "from-teal-600 to-teal-800",
      borderClass: "border-teal-500",
      icon: <RiSwordFill className="text-teal-300" />,
      pathClass: "stroke-teal-600",
      glowColor: "rgba(13, 148, 136, 0.6)"
    },
    advanced: {
      bgClass: "from-green-600 to-green-800",
      borderClass: "border-green-500",
      icon: <RiShieldFill className="text-green-300" />,
      pathClass: "stroke-green-600",
      glowColor: "rgba(16, 185, 129, 0.6)"
    },
    mastered: {
      bgClass: "from-purple-600 to-purple-800",
      borderClass: "border-purple-500",
      icon: <GiCrystalBall className="text-purple-300" />,
      pathClass: "stroke-purple-500",
      glowColor: "rgba(139, 92, 246, 0.7)"
    }
  };

  // Helper function to handle topic expansion
  const handleNodeClick = (topicId) => {
    setExpandedNodeId(expandedNodeId === topicId ? null : topicId);
    const topic = curriculum.topics.find(t => t.id === topicId);
    if (topic) {
      onTopicSelect(topic);
    }
  };

  // Helper function to handle question selection
  const handleQuestionClick = (questionId) => {
    onQuestionSelect(questionId);
    onClose(); // Close the modal after selection
  };

  return (
    <>
      {/* Backdrop with stars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9990] bg-slate-900/90 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Subtle star field */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              boxShadow: `0 0 ${Math.random() * 3 + 1}px rgba(255, 255, 255, 0.7)`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 1 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Main panel */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed inset-8 md:inset-16 z-[9999] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle gradient border */}
        <div className="absolute -inset-1 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600">
            <motion.div
              className="w-full h-full"
              animate={{ opacity: [0.6, 0.8, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Content container */}
        <div className="absolute inset-0 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
            <div className="flex items-center justify-between">
              {/* Title */}
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg mr-3">
                  <FaStar className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Skill Tree</h2>
                  <div className="flex items-center mt-1">
                    <div className="h-1 w-32 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 to-teal-400"
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-cyan-400 ml-2">Level 5</p>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="rounded-full p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main content area - skill tree */}
          <div className="flex-grow p-6 overflow-auto">
            <div className="grid gap-y-6 max-w-4xl mx-auto">
              {curriculum.topics.map((topic, index) => {
                const status = getNodeStatus(topic);
                const config = statusConfig[status];
                const isLocked = status === "locked";
                const isExpanded = expandedNodeId === topic.id;
                const progress = topicProgress[topic.id] || { percent: 0, completed: 0, total: 0 };
                const stars = Math.min(3, Math.floor(progress.percent / 33.34) + (progress.percent === 100 ? 1 : 0));

                // Previous and next topics for connections
                const prevTopic = index > 0 ? curriculum.topics[index - 1] : null;
                const nextTopic = index < curriculum.topics.length - 1 ? curriculum.topics[index + 1] : null;

                return (
                  <div key={topic.id} className="relative">
                    {/* Connection to previous topic */}
                    {prevTopic && (
                      <div className="absolute left-1/2 top-0 w-px h-6 -mt-6 bg-gradient-to-t from-cyan-500 to-transparent opacity-50"></div>
                    )}

                    {/* Connection to next topic */}
                    {nextTopic && (
                      <div className="absolute left-1/2 bottom-0 w-px h-6 -mb-6 bg-gradient-to-b from-cyan-500 to-transparent opacity-50"></div>
                    )}

                    {/* Topic card */}
                    <motion.div
                      className={`bg-gradient-to-br ${config.bgClass} rounded-lg border ${config.borderClass} shadow-lg overflow-hidden relative`}
                      whileHover={!isLocked ? { scale: 1.02, y: -2 } : {}}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      {/* Main card content */}
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => !isLocked && handleNodeClick(topic.id)}
                      >
                        <div className="flex items-center">
                          {/* Topic icon */}
                          <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center border border-slate-600 mr-4">
                            {config.icon}
                          </div>

                          {/* Topic info */}
                          <div className="flex-grow">
                            <div className="flex justify-between items-center">
                              <h3 className="text-white font-bold text-lg">{topic.name}</h3>
                              <div className="flex items-center">
                                {/* Star rating */}
                                <div className="flex">
                                  {Array.from({ length: 3 }).map((_, i) => (
                                    <FaStar
                                      key={i}
                                      className={`w-4 h-4 mx-0.5 ${
                                        i < stars ? 'text-yellow-400' : 'text-slate-600'
                                      }`}
                                    />
                                  ))}
                                </div>

                                {/* Expand toggle */}
                                <motion.div
                                  animate={{ rotate: isExpanded ? 90 : 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="ml-2 text-cyan-300"
                                >
                                  <FaChevronRight />
                                </motion.div>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-2">
                              <div className="flex justify-between items-center text-xs mb-1">
                                <span className="text-gray-300">Progress</span>
                                <span className="text-cyan-300">{progress.completed}/{progress.total} Complete</span>
                              </div>
                              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-cyan-400 to-teal-400"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress.percent}%` }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded questions section */}
                      <AnimatePresence>
                        {isExpanded && !isLocked && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-800 border-t border-slate-700 overflow-hidden"
                          >
                            <div className="p-3 space-y-2">
                              <h4 className="text-sm font-medium text-cyan-300 mb-2">Available Questions</h4>
                              {topic.questions.map((qId) => {
                                const question = curriculum.questions.find(q => q.id === qId);
                                if (!question) return null;

                                const isCompleted = completedQuestions.includes(qId);
                                const isActive = selectedQuestion && selectedQuestion.id === qId;

                                return (
                                  <motion.div
                                    key={`question-${qId}`}
                                    className={`p-3 rounded-lg cursor-pointer ${
                                      isCompleted
                                        ? 'bg-green-900/30 border border-green-700/50'
                                        : isActive
                                          ? 'bg-cyan-900/30 border border-cyan-700/50'
                                          : 'bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700'
                                    }`}
                                    whileHover={{ x: 3 }}
                                    onClick={() => handleQuestionClick(qId)}
                                  >
                                    <div className="flex items-center">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                        isCompleted ? 'bg-green-700' : 'bg-slate-600'
                                      }`}>
                                        {isCompleted ? (
                                          <FaCheckCircle className="text-green-300 text-xs" />
                                        ) : (
                                          <span className="text-white text-xs font-bold">{qId}</span>
                                        )}
                                      </div>
                                      <div className="flex-grow min-w-0">
                                        <p className="text-white font-medium truncate">
                                          {question.title}
                                        </p>
                                        <div className="flex items-center mt-1">
                                          <FaStar className="text-yellow-400 text-xs mr-1" />
                                          <span className="text-yellow-300 text-xs">{question.points} points</span>
                                          {question.description && (
                                            <span className="ml-2 text-xs text-gray-400 truncate">
                                              {question.description.substring(0, 50)}
                                              {question.description.length > 50 ? '...' : ''}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-700">
            <div className="flex justify-between items-center">
              {/* Points display */}
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-700 rounded-lg px-3 py-2 flex items-center shadow-lg">
                  <FaStar className="text-white mr-2" />
                  <span className="text-white font-bold">{score}</span>
                </div>
                <p className="ml-3 text-gray-300 text-sm">Total Points</p>
              </div>

              {/* Continue button */}
              <motion.button
                onClick={onClose}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg border border-cyan-500/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue Quest
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SkillTreeModal;