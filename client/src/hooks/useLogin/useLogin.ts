import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export default function useLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        // Mock authentication - replace with real API call
        const MOCK_EMAIL = 'demo@financetracker.com';
        const MOCK_PASSWORD = 'demo123';
        if (email !== MOCK_EMAIL || password !== MOCK_PASSWORD) {
            setError('Invalid email or password. Use demo credentials above.');
            return;
        }
        // Store auth token, user data, etc.
        localStorage.setItem('authToken', 'mock-token');
        navigate('/');
    };

    return { email, setEmail, password, setPassword, error, handleSubmit };
}
