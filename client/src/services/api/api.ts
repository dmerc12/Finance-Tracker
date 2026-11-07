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
 * CSRF protection uses a double-submit cookie: a request interceptor reads the {@code XSRF-TOKEN}
 * cookie (readable by JS, by design) and echoes it in {@code X-XSRF-TOKEN} on state-changing requests.
 * The cookie is established by {@link ensureCsrfCookie}, which must be called once at app bootstrap
 * - see {@code SessionBootstrap}.
 * The auth cookies remain HTTP-only; only the CSRF token is JavaScript-readable.
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
 * Reads a cookie value by name. Used only for the CSRF double-submit cookie;
 * HttpOnly auth cookies are never readable from JavaScript by design.
 */
const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
};

/**
 * Attaches the CSRF header on state-changing requests.
 * <p>Spring Security's {@code CsrfConfigurer.spa()} writes the raw token to the
 * {@code XSRF-TOKEN} cookie and expects it back in {@code X-XSRF-TOKEN}.
 * The cookie is a session cookie, so it must be re-established on each app load -
 * see {@link ensureCsrfCookie}
 */
api.interceptors.request.use((config) => {
    const method = (config.method ?? 'get').toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
        const token = getCookie('XSRF-TOKEN');
        if (token) {
            config.headers.set('X-XSRF-TOKEN', token);
        }
    }
    return config;
});

/**
 * One-shot promise that resolves once the CSRF cookie has been established.
 * <p>Call this from application bootstrap before rendering the app,
 * so the first login or register POST carries a valid token.
 */
let csrfPromise: Promise<void> | null = null;
export function ensureCsrfCookie(): Promise<void> {
    if (!csrfPromise) {
        csrfPromise = api
            .get('/auth/csrf')
            .then(() => undefined)
            .catch((err) => {
                csrfPromise = null;
                throw err;
            });
    }
    return csrfPromise;
}

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
 * <p>Logs at the severity appropriate to the failure mode; never swallows the rejection.
 * {@link getErrorData} is what callers use to build a user-facing message -
 * this function exists for observability only.
 * <ul>
 *     <li><b>401</b> - warn (auth event, already wired to refresh flow)</li>
 *     <li><b>403</b> - warn (permission failure)</li>
 *     <li><b>5xx</b> - error (server fault, actionable for monitoring)</li>
 *     <li><b>Timeout / network</b> - warn</li>
 * </ul>
 */
export const errorHandler = (error: unknown): Promise<never> => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
            console.warn('Unauthorized - user needs to log in again.');
        } else if (status === 403) {
            console.warn('Forbidden - user lacks permission for this resource.');
        } else if (status !== undefined && status >= 500) {
            console.error('Server error', status, error.response?.data);
        } else if (error.code === 'ECONNABORTED') {
            console.warn('Request timed out.');
        } else if (error.code === 'ERR_NETWORK') {
            console.warn('Network error - unable to reach server.');
        }
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
