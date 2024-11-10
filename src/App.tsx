import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import DrawingBoard from './components/drawing';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignOutButton from '@components/SignOutButton';
import { StudentPage } from '@components/studentPage';
import { TeacherPage } from '@components/teacherPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
                    <Routes>
                        <Route path="/auth" element={<AuthPage />} />
                        <Route
                            path="/whiteboard"
                            element={
                                <ProtectedRoute>
                                    <DrawingBoard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/student"
                            element={
                                <ProtectedRoute>
                                    <DrawingBoard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/teacher"
                            element={
                                <ProtectedRoute>
                                    <DrawingBoard />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/auth" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
