import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaChevronDown, FaCheckCircle } from 'react-icons/fa';

const QuestionSelector = ({
  curriculum,
  completedQuestions,
  onTopicSelect,
  onQuestionSelect,
  selectedTopic,
  selectedQuestion,
  onClose
}) => {
  const [expandedTopic, setExpandedTopic] = useState(null);

  const handleTopicClick = (topic) => {
    if (expandedTopic === topic.id) {
      setExpandedTopic(null);
    } else {
      setExpandedTopic(topic.id);
      onTopicSelect(topic);
    }
  };

  const handleQuestionClick = (questionId) => {
    const question = curriculum.questions.find(q => q.id === questionId);
    if (question) {
      onQuestionSelect(questionId);
      setTimeout(() => {
        onClose();
      }, 300);
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <FaStar className="text-cyan-400 mr-3" />
        Select Question
      </h2>

      <div className="space-y-4">
        {curriculum.topics.map((topic) => {
          const isExpanded = expandedTopic === topic.id;
          const isSelected = selectedTopic && selectedTopic.id === topic.id;
          const completedCount = topic.questions.filter(qId => completedQuestions.includes(qId)).length;
          const progress = (completedCount / topic.questions.length) * 100;

          return (
            <div
              key={topic.id}
              className={`rounded-lg overflow-hidden ${topic.locked ? 'opacity-60' : ''}`}
            >
              <motion.div
                className={`p-4 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-cyan-700 bg-opacity-50 border border-cyan-500'
                    : 'bg-slate-800 bg-opacity-50 border border-slate-700 hover:border-cyan-600'
                }`}
                onClick={() => !topic.locked && handleTopicClick(topic)}
                whileHover={{ scale: topic.locked ? 1 : 1.01 }}
                layout
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-md mr-3 bg-cyan-600 text-white font-bold">
                      {topic.id}
                    </div>
                    <h3 className="font-bold text-white">
                      {topic.name}
                      {topic.locked && (
                        <span className="ml-2 text-xs bg-slate-700 py-1 px-2 rounded text-slate-300">
                          Locked
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="flex items-center">
                    <div className="text-xs text-cyan-300 mr-3">
                      {completedCount}/{topic.questions.length}
                    </div>
                    {!topic.locked && (
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaChevronDown className="text-cyan-400" />
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="mt-2 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>

              {!topic.locked && isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-800 bg-opacity-30 border-x border-b rounded-b-lg border-slate-700"
                >
                  <div className="p-3 grid gap-2">
                    {topic.questions.map((questionId) => {
                      const question = curriculum.questions.find(q => q.id === questionId);
                      const isCompleted = completedQuestions.includes(questionId);
                      const isActive = selectedQuestion && selectedQuestion.id === questionId;

                      return question && (
                        <motion.div
                          key={questionId}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            isActive
                              ? 'bg-cyan-700 bg-opacity-40 border border-cyan-500'
                              : isCompleted
                                ? 'bg-green-700 bg-opacity-20 border border-green-600'
                                : 'bg-slate-700 bg-opacity-40 border border-slate-600 hover:border-cyan-600'
                          }`}
                          onClick={() => handleQuestionClick(questionId)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mr-3 ${
                                isActive ? 'bg-cyan-600' : isCompleted ? 'bg-green-600' : 'bg-slate-600'
                              }`}>
                                {questionId}
                              </div>
                              <div>
                                <h4 className="font-medium text-white text-sm">{question.title}</h4>
                                <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                                  {question.description}
                                </p>
                              </div>
                            </div>

                            {isCompleted && (
                              <FaCheckCircle className="text-green-400 ml-2 flex-shrink-0" />
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-600/50">
                            <span className="text-xs bg-cyan-900/40 text-cyan-300 px-2 py-0.5 rounded">
                              {question.points} points
                            </span>

                            {isCompleted ? (
                              <span className="text-xs text-green-400">Completed</span>
                            ) : isActive ? (
                              <span className="text-xs text-cyan-400">Selected</span>
                            ) : (
                              <span className="text-xs text-gray-400">Not started</span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionSelector;