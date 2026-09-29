/**
 * Payload of `ResponseDTO<LoginResponse>` from POST /api/auth/login.
 *
 * The backend also sets accessToken and refreshToken as HTTP-only cookies.
 * The frontend relies on those cookies (via `withCredentials: true` on the
 * axios instance) and never reads or stores these fields directly.
 */
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}
