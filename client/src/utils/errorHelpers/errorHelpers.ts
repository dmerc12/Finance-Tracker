import { isAxiosError } from 'axios';

/**
 * Safely extract user-facing error data from an unknown error.
 * <p>Distinguishes timeout, network failure, 403 Forbidden, and 5xx server errors
 * so the caller can present a message appropriate to the failure mode.
 * For Axios errors with a server response, reads {@code response.data} as a ResponseDTO-like shape.
 * For other errors, returns a generic message.
 *
 * @param error the caught value
 * @returns a message suitable for display plus any field-level errors
 */
export function getErrorData(error: unknown): {
    message: string;
    fieldErrors: Record<string, string>;
} {
    // Axios error (e.g., API error response)
    if (isAxiosError(error)) {
        // Request budget exceeded before a response arrived
        if (error.code === 'ECONNABORTED') {
            return {
                message: 'The request took too long. Please try again.',
                fieldErrors: {},
            };
        }
        // No response: offline, DNS, connection refused, or CORS preflight blocked
        if (error.code === 'ERR_NETWORK') {
            return {
                message: 'Unable to reach the server. Check your connection and try again.',
                fieldErrors: {},
            };
        }
        const status = error.response?.status;
        const data = error.response?.data as unknown as {
            message?: string;
            fieldErrors?: Record<string, string>;
        };
        if (status === 403) {
            return {
                message: data?.message || "You don't have permission to perform this action.",
                fieldErrors: {},
            };
        }
        if (status !== undefined && status >= 500) {
            return {
                message: data?.message || 'The server encountered an error. Please try again later.',
                fieldErrors: {},
            };
        }
        return {
            message: data?.message || 'An error occurred',
            fieldErrors: data?.fieldErrors || {},
        };
    }
    // Non-Axios error (e.g., network failure or thrown string)
    return {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        fieldErrors: {},
    };
}
