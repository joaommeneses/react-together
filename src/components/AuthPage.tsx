import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    AuthContainer,
    AuthCard,
    IconContainer,
    Title,
    Text,
    Button
} from '../styles/AuthStyles';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === "Student") {
                navigate('/student');
            } else if (user.role === "Professor") {
                navigate('/teacher');
            }
        }
    }, [user, navigate]);

    return (
        <AuthContainer>
            <AuthCard>
                <IconContainer>
                    <Lock style={{ width: '1.5rem', height: '1.5rem', color: '#4F46E5' }} />
                </IconContainer>

                <Title>
                    {isLogin ? 'Welcome back' : 'Create account'}
                </Title>

                <Text>
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <Button
                        variant="link"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </Button>
                </Text>
                <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

                {isLogin ? <LoginForm /> : <RegisterForm />}
            </AuthCard>
        </AuthContainer>
    );
};

export default AuthPage;
