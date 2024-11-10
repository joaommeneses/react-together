import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    FormContainer,
    InputGroup,
    InputWrapper,
    IconWrapper,
    Input,
    ErrorText
} from '../styles/FormStyles';
import { Button } from '../styles/AuthStyles';

const LoginForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const validateForm = () => {
        const newErrors = {
            email: '',
            password: ''
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await login(formData.email, formData.password);
                toast.success('Login successful!');
                navigate('/whiteboard'); // Redirect to the whiteboard page
            } catch (error) {
                console.error('Error logging in:', error);
                toast.error('Login failed. Please check your credentials.');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <FormContainer onSubmit={handleSubmit}>
            <InputGroup>
                <InputWrapper>
                    <IconWrapper>
                        <User style={{ width: '1.25rem', height: '1.25rem' }} />
                    </IconWrapper>
                    <Input
                        name="email"
                        type="text"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                    {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </InputWrapper>

                <InputWrapper>
                    <IconWrapper>
                        <Lock style={{ width: '1.25rem', height: '1.25rem' }} />
                    </IconWrapper>
                    <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            right: '0.75rem',
                            cursor: 'pointer'
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff style={{ width: '1.25rem', height: '1.25rem', color: '#9CA3AF' }} />
                        ) : (
                            <Eye style={{ width: '1.25rem', height: '1.25rem', color: '#9CA3AF' }} />
                        )}
                    </div>
                    {errors.password && <ErrorText>{errors.password}</ErrorText>}
                </InputWrapper>
            </InputGroup>

            <Button type="submit">Log in</Button>
        </FormContainer>
    );
};

export default LoginForm;
