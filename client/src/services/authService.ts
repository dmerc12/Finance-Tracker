import api from './api';

export const login = (email: string, password: string) => {
    // TODO: implement login
    return api.post('/auth/login', { email, password });
};

export const register = (email: string, password: string) => {
    // TODO: implement register
    return api.post('/auth/register', { email, password });
};

export const logout = () => {
    // TODO: implement logout (clear cookies, etc.)
};

export const getCurrentUser = () => {
    // TODO: implement get current user
    return api.get('/auth/me');
};
