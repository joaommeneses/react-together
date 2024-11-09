import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        password: ''
    });

    const validateForm = () => {
        const newErrors = {
            username: '',
            password: ''
        };

        if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            login(formData.username, formData.password);
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
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                    />
                    {errors.username && <ErrorText>{errors.username}</ErrorText>}
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
                    <div style={{
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

            <Button type="submit">Sign in</Button>
        </FormContainer>
    );
};

export default LoginForm;