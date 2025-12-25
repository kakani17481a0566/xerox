import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import XeroxLogin from './pages/XeroxLogin';
import XeroxDashboard from './pages/XeroxDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAppContext();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<StudentLogin />} />
            <Route path="/xerox" element={<XeroxLogin />} />

            {/* Protected Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/xerox-dashboard"
              element={
                <ProtectedRoute allowedRole="xerox">
                  <XeroxDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
