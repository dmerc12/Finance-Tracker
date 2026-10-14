import api from '../api';
import type {
    ResponseDTO,
    UserDTO,
    RegisterRequest,
    LoginRequest,
    LoginResponse,
} from '../../types';

/**
 * Authentication API service with HTTP-only cookie support.
 * <p>All methods use the axios instance with {@code withCredentials: true},
 * so the JWT cookie is automatically sent with every request.
 */
export const authService = {
    /**
     * Log in a user with email and password.
     * <p>The backend validates credentials and sets an HTTP-only cookie containing the JWT.
     * @param data login data
     * @returns Promise with the response
     */
    login: (data: LoginRequest) => {
        return api.post<ResponseDTO<LoginResponse>>('/auth/login', data);
    },
    /**
     * Register a new user.
     * <p>After successful registration, the user may be automatically logged in.
     * @param data registration data
     * @returns Promise with the response
     */
    register: (data: RegisterRequest) => {
        return api.post<ResponseDTO<UserDTO>>('/auth/register', data);
    },
    /**
     * Log out the current user.
     * <p>The backend blacklists the current access and refresh tokens and clears the auth cookies.
     * Safe to call from any auth state - an unauthenticated caller still receives 200 and has
     * their cookies cleared.
     * @returns Promise with the response
     */
    logout: () => {
        return api.post<ResponseDTO<void>>('/auth/logout');
    },
    /**
     * Fetch the current authenticated user's details.
     * <p>The JWT cookie is sent automatically by the browser - no token
     * parameter is required. Returns the standard {@code ResponseDTO<UserDTO>}
     * envelope; callers typically consume {@code response.data.data}.
     * @returns Promise with the response
     */
    getCurrentUser: () => {
        return api.get<ResponseDTO<UserDTO>>('/auth/me');
    },
};
