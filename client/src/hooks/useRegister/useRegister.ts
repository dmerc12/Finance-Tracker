import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export default function useRegister() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        // Replace with real API call
        console.log('Registration attempt:', { email, password });
        setSuccess('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        success,
        handleSubmit,
    };
}
