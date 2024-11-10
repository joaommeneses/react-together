import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

import {
    FormContainer,
    InputGroup,
    InputWrapper,
    IconWrapper,
    Input,
    ErrorText,
    SelectWrapper
} from '../styles/FormStyles';
import { Button } from '../styles/AuthStyles';

const RegisterForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Student' // Default role is "Student"
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    });

    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {
            email: '',
            password: '',
            confirmPassword: '',
            role: ''
        };

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.role) {
            newErrors.role = 'Please select a role';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );
                const user = userCredential.user;
                await setDoc(doc(db, 'users', user.uid), {
                    email: formData.email,
                    role: formData.role // Store role as "Student" or "Professor"
                });
                toast.success('Registration successful!');
                if (formData.role === "Student") {
                    navigate('/student');
                } else if (formData.role === "Professor") {
                    navigate('/teacher');
                }
            } catch (error) {
                console.error('Error registering user:', error);
                toast.error('Registration failed. Please try again.');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                        type="email"
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

                <InputWrapper>
                    <Input
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                    />
                    {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
                </InputWrapper>

                <InputWrapper>
                    <SelectWrapper>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange} // onChange should work here
                            style={{ width: '100%', padding: '0.5rem' }}
                        >
                            <option value="Professor">Professor</option>
                            <option value="Student">Student</option>
                        </select>
                    </SelectWrapper>
                    {errors.role && <ErrorText>{errors.role}</ErrorText>}
                </InputWrapper>

            </InputGroup>

            <Button type="submit">Register</Button>
        </FormContainer>
    );
};

export default RegisterForm;
