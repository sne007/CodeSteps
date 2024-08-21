import React from 'react';
import { motion } from 'framer-motion';
import { LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import {useCurriculum} from "./context/CurriculumContext";

const LearningPath = () => {
    const { curriculum, selectedTopic, setSelectedTopic, setSelectedQuestion, completedQuestions } = useCurriculum();

    if (!curriculum) return null;

    const handleTopicClick = (topic) => {
        setSelectedTopic(topic);
        if (topic.questions.length > 0) {
            const firstQuestionId = topic.questions[0];
            const question = curriculum.questions.find(q => q.id === firstQuestionId);
            setSelectedQuestion(question);
        } else {
            setSelectedQuestion(null);
        }
    };

    const getTopicProgress = (topic) => {
        // const completedCount = topic.questions.filter(qId => completedQuestions.includes(qId)).length;
        // return (completedCount / topic.questions.length) * 100;
        // TODO: Remove hardcode
        return 50;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6 text-indigo-900">Learning Path</h3>
            <div className="space-y-6">
                {curriculum.topics.map((topic, index) => (
                    <motion.div
                        key={topic.id}
                        className={`relative p-4 rounded-lg border-2 cursor-pointer overflow-hidden ${
                            topic.locked ? 'border-gray-300 bg-gray-100' : 'border-indigo-500 bg-indigo-50'
                        } ${selectedTopic && selectedTopic.id === topic.id ? 'ring-2 ring-indigo-500' : ''}`}
                        onClick={() => !topic.locked && handleTopicClick(topic)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <h4 className={`font-semibold ${topic.locked ? 'text-gray-500' : 'text-indigo-700'}`}>
                            {topic.name}
                        </h4>
                        {topic.locked ? (
                            <LockClosedIcon className="h-5 w-5 text-gray-500 absolute top-2 right-2" />
                        ) : (
                            <div className="mt-2">
                                <div className="flex items-center">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                        <motion.div
                                            className="bg-indigo-600 h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${getTopicProgress(topic)}%` }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                        />
                                    </div>
                                    <span className="text-sm text-indigo-600 font-medium">
                                        {topic.questions.filter(qId => completedQuestions.includes(qId)).length}/{topic.questions.length}
                                    </span>
                                </div>
                            </div>
                        )}
                        {getTopicProgress(topic) === 100 && (
                            <CheckCircleIcon className="h-6 w-6 text-green-500 absolute top-2 right-2" />
                        )}
                        {index < curriculum.topics.length - 1 && (
                            <div className="absolute left-1/2 -bottom-3 w-0.5 h-3 bg-indigo-300" />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default LearningPath;