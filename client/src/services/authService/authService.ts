import { type RegisterRequest } from '../../types';
import api from '../api';

/**
 * Authentication API service with HTTP-only cookie support.
 * <p>All methods use the axios instance with {@code withCredentials: true},
 * so the JWT cookie is automatically sent with every request.
 * <p><b>Important:</b> These are placeholder implementations.
 * Full endpoints will be implemented when the backend authentication endpoints re ready.
 */
export const authService = {
    /**
     * Log in a user with email and password.
     * <p>The backend validates credentials and sets an HTTP-only cookie containing the JWT.
     * @param email the user's email
     * @param password the user's password
     * @returns Promise with the response
     */
    login: (email: string, password: string) => {
        // TODO: implement login
        console.log('Login called with:', { email, password });
        return api.post('/auth/login', { email, password });
    },
    /**
     * Register a new user.
     * <p>After successful registration, the user may be automatically logged in.
     * @param data registration data
     * @returns Promise with the response
     */
    register: (data: RegisterRequest) => {
        console.log('Register called with:', data);
        return api.post('/auth/register', data);
    },
    /**
     * Log out the current user.
     * <p>The backend clears the HTTP-only cookie.
     */
    logout: () => {
        // TODO: implement logout (clear cookies, etc.)
        console.log('Logout called');
        return api.post('/auth/logout');
    },
    /**
     * Fetch the current authenticated user's details.
     * <p>The cookie is automatically sent, so no token is required in the request.
     * @returns Promise with user data
     */
    getCurrentUser: () => {
        // TODO: implement get current user
        console.log('getCurrentUser called');
        return api.get('/auth/me');
    },
};
