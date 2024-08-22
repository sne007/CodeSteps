import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LanguageSelectionPage from '../src/components/LanguageSelectionPage';
import CurriculumPage from '../src/components/CurriculumPage';
import LoginPage from '../src/components/LoginPage';
import { AuthProvider, useAuth } from '../src/components/context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<LanguageSelectionPage />} />
                <Route path="/curriculum/:languageId" element={<CurriculumPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;