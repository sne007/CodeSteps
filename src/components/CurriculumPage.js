import React from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import LearningPath from './LearningPath';
import QuestionList from './QuestionList';
import CodeEditor from './CodeEditor/CodeEditor';
import { CurriculumProvider } from './context/CurriculumContext';

const CurriculumPage = () => {
    const { languageId } = useParams();

    return (
        <CurriculumProvider languageId={languageId}>
            <PageLayout>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <LearningPath />
                    </div>
                    <div className="lg:col-span-2">
                        <CodeEditor />
                        <QuestionList />
                    </div>
                </div>
            </PageLayout>
        </CurriculumProvider>
    );
};

export default CurriculumPage;