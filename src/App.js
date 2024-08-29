import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LanguageSelectionPage from './components/LanguageSelectionPage';
import CurriculumPage from './components/CurriculumPage';
import { CurriculumProvider } from './components/context/CurriculumContext';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LanguageSelectionPage />} />
                <Route
                    path="/curriculum/:languageId"
                    element={
                        <CurriculumProvider>
                            <CurriculumPage />
                        </CurriculumProvider>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;