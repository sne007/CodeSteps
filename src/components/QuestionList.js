import React from 'react';
import { motion } from 'framer-motion';
import { useCurriculum } from './context/CurriculumContext';

const QuestionList = () => {
    const { curriculum, selectedTopic, selectedQuestion, setSelectedQuestion } = useCurriculum();

    if (!selectedTopic) {
        return null;
    }

    return (
        <div className="space-y-4 mb-8">
            <h3 className="text-xl font-bold text-indigo-900 mb-4">Questions for {selectedTopic.name}</h3>
            {selectedTopic.questions.map((questionId) => {
                const question = curriculum.questions.find(q => q.id === questionId);
                return (
                    <motion.div
                        key={question.id}
                        className={`bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg ${
                            selectedQuestion && selectedQuestion.id === question.id ? 'ring-2 ring-indigo-500' : ''
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedQuestion(question)}
                    >
                        <h4 className="text-lg font-semibold text-indigo-900">Question {question.id}: {question.title}</h4>
                        <p className="text-gray-600">{question.description}</p>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default QuestionList;