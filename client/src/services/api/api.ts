import axios from 'axios';

/**
 * Axios instance configured for the Finance Tracker API.
 * <p>Key features:
 * <ul>
 *     <li>Base URL from environment variable</li>
 *     <li><b>withCredentials: true</b> - automatically sends HTTP-only cookies (JWT) with requests</li>
 *     <li>No Authorization header needed - cookies are auto-sent by the browser</li>
 *     <li>Response interceptor handles 401 (unauthorized) errors
 * <ul>
 * <p><b>Security Note:</b>
 * The JWT is stored in an HTTP-only cookie, which protects against XSS attacks.
 * CSRF protection is handled by the backend using a cookie-based CSRF token.
 * <p><b>CORS Note:</b>
 * The backend must allow credentials and list the frontend origin in CORS configuration.
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/api' || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

/**
 * Global error handler:
 * <p>Handles common errors like:
 * <ul>
 *     <li><b>401 Unauthorized</b> - User's JWT expired/invalid; redirect to login</li>
 *     <li><b>403 Forbidden</b> - User lacks required permissions</li>
 *     <li><b>500 Internal Server Error</b> - Log and show user-friendly message</li>
 * </ul>
 */
export const errorHandler = (error: any) => {
    // TODO: Implement proper error handling with Redux
    // - On 401: dispatch logout, clear user state, redirect to /login
    // - On 403: show "Access Denied" notification
    // - On 500: show generic error message
    if (error.response?.status === 401) {
        console.warn('Unauthorized - user needs to log in again.');
        // Will be handled by thunk logic
    }
    return Promise.reject(error);
};

/**
 * Response interceptor
 */
api.interceptors.response.use((response) => response, errorHandler);

export default api;
