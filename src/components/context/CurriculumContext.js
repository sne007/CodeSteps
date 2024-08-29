import React, { createContext, useContext, useState, useEffect } from 'react';
import { curriculumData } from "../../data/curriculumData";

const CurriculumContext = createContext();

export const CurriculumProvider = ({ children }) => {
    const [curriculum, setCurriculum] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [completedQuestions, setCompletedQuestions] = useState([]);

    useEffect(() => {
        // Simulating an API call to fetch curriculum data
        setTimeout(() => {
            setCurriculum(curriculumData.python); // Using Python as default
            if (curriculumData.python.topics.length > 0) {
                setSelectedTopic(curriculumData.python.topics[0]);
                if (curriculumData.python.topics[0].questions.length > 0) {
                    setSelectedQuestion(curriculumData.python.questions.find(q => q.id === curriculumData.python.topics[0].questions[0]));
                }
            }
        }, 1000);
    }, []);

    const completeQuestion = (questionId) => {
        if (!completedQuestions.includes(questionId)) {
            setCompletedQuestions([...completedQuestions, questionId]);
            setScore(prevScore => prevScore + 10); // Assuming each question is worth 10 points
        }
    };

    const value = {
        curriculum,
        selectedTopic,
        setSelectedTopic,
        selectedQuestion,
        setSelectedQuestion,
        score,
        setScore,
        completedQuestions,
        completeQuestion,
    };

    return (
        <CurriculumContext.Provider value={value}>
            {children}
        </CurriculumContext.Provider>
    );
};

export const useCurriculum = () => {
    const context = useContext(CurriculumContext);
    if (context === undefined) {
        throw new Error('useCurriculum must be used within a CurriculumProvider');
    }
    return context;
};