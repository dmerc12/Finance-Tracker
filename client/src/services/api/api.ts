import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

/**
 * Axios instance configured for the Finance Tracker API.
 * <p>Key features:
 * <ul>
 *     <li>Base URL from environment variable</li>
 *     <li>
 *         <b>withCredentials: true</b> - automatically sends HTTP-only cookies (JWT) with requests
 *     </li>
 *     <li>No Authorization header needed - cookies are auto-sent by the browser</li>
 *     <li>
 *         Response interceptor transparently refreshes an expired access token on 401
 *         and retries the original request once
 *      </li>
 * <ul>
 * <p><b>Security Note:</b>
 * The JWT is stored in an HTTP-only cookie, which protects against XSS attacks.
 * CSRF protection is handled by the backend using a cookie-based CSRF token.
 * <p><b>CORS Note:</b>
 * The backend must allow credentials and list the frontend origin in CORS configuration.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const baseURL = API_BASE_URL ? `${API_BASE_URL}/api` : 'http://localhost:8080/api';
const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

/**
 * Endpoints that must not trigger the refresh flow.
 * A 401 from any of these is either an expected outcome (bad credentials on login/register)
 * or would recurse (a 401 from the refresh endpoint itself).
 */
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

/**
 * Marker added to a request config so the interceptor can tell whether it has
 * already retired this request after a refresh.
 * Prevents infinite loops when the rotated cookie is also rejected.
 */
interface RetriableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

/**
 * Callback invoked when a 401 cannot be recovered by refreshing.
 * Set this from application bootstrap (see main.tsx) so the interceptor can clear auth state
 * and redirect without importing the Redux store directly (which would create a circular
 * dependency between the store and the services layer).
 */
type AuthFailureHandler = () => void;
let onAuthFailure: AuthFailureHandler | null = null;

/**
 * Registers the handler invoked when the refresh flow fails and the user must be signed out locally.
 *
 * @param handler callback that resets auth and user state and redirects to /login
 */
export function setAuthFailureHandler(handler: AuthFailureHandler): void {
    onAuthFailure = handler;
}

/**
 * Single in-flight refresh promise.
 * When several requests 401 at once, they all await this promise rather than each triggering a refresh;
 * the backend would otherwise invalidate one rotated token with the next.
 */
let refreshPromise: Promise<void> | null = null;

/**
 * Triggers {@code POST /auth/refresh}.
 * On success the backend rotates the access-token and refresh-token cookies in the response,
 * so the caller does not need to read anything from the body.
 *
 * @returns a promise that resolves once the cookies have been updated
 */
const refreshAccessToken = async (): Promise<void> => {
    if (!refreshPromise) {
        refreshPromise = api
            .post('/auth/refresh')
            .then(() => undefined)
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

/**
 * Final error handler for responses the interceptor cannot recover.
 * <p>Handles:
 * <ul>
 *     <li><b>401 Unauthorized</b> - logs a warning; the caller receives the rejection</li>
 *     <li><b>403 Forbidden</b> - passes through unchanged</li>
 *     <li>Everything else - passes through unchanged</li>
 * </ul>
 */
export const errorHandler = (error: unknown): Promise<never> => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn('Unauthorized - user needs to log in again.');
    }
    return Promise.reject(error);
};

/**
 * Response interceptor: on 401, attempt a single refresh and retry the original request once.
 * Any other outcome falls through to {@link errorHandler}.
 */
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetriableRequestConfig | undefined;
        const isRetriable =
            error.response?.status === 401 &&
            originalRequest !== undefined &&
            !originalRequest._retry &&
            !AUTH_ENDPOINTS.some((path) => originalRequest.url?.includes(path));
        if (isRetriable) {
            originalRequest._retry = true;
            try {
                await refreshAccessToken();
                return await api(originalRequest);
            } catch {
                onAuthFailure?.();
            }
        }
        return errorHandler(error);
    }
);

export default api;
