import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LanguageSelectionPage from '../src/components/LanguageSelectionPage';
import CurriculumPage from '../src/components/CurriculumPage';
import LoginPage from '../src/components/LoginPage';

export function App(props) {
  return (
      <Router>
        <div className='App'>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<LanguageSelectionPage />} />
            <Route path="/curriculum/:languageId" element={<CurriculumPage />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;