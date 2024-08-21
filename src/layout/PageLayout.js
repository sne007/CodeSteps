import React from 'react';
import Header from '../components/common/Header';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/common/Footer';
import { useCurriculum } from "../components/context/CurriculumContext";

const PageLayout = ({ children }) => {
    const { score, setScore } = useCurriculum();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Header score={score} setScore={setScore} />
                <Breadcrumb />
                <main>{children}</main>
                <Footer />
            </div>
        </div>
    );
};

export default PageLayout;