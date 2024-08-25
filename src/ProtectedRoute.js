import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '../src/components/context/AuthContext';

const ProtectedRoute = () => {
    const { authState } = useAuth();

    if (authState === 'loading') {
        return <div>Loading...</div>;
    }

    return authState === 'signedIn' ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;