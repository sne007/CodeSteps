import React, { createContext, useContext, useState, useEffect } from 'react';
import {curriculumData} from "../../data/curriculumData";

const CurriculumContext = createContext();

export const CurriculumProvider = ({ children, languageId }) => {
    const [curriculum, setCurriculum] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [completedQuestions, setCompletedQuestions] = useState([]);

    useEffect(() => {
        const currentCurriculum = curriculumData[languageId];
        setCurriculum(currentCurriculum);
        if (currentCurriculum && currentCurriculum.topics.length > 0) {
            setSelectedTopic(currentCurriculum.topics[0]);
            if (currentCurriculum.topics[0].questions.length > 0) {
                setSelectedQuestion(currentCurriculum.questions.find(q => q.id === currentCurriculum.topics[0].questions[0]));
            }
        }
    }, [languageId]);

    const completeQuestion = (questionId) => {
        if (!completedQuestions.includes(questionId)) {
            setCompletedQuestions([...completedQuestions, questionId]);
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