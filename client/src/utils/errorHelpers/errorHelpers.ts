import { isAxiosError } from 'axios';

/**
 * Safely extract error data from an unknown error.
 * For Axios errors, reads `response.data` as a ResponseDTO-like shape.
 * For other errors, returns a generic message.
 * @param error
 */
export function getErrorData(error: unknown): {
    message: string;
    fieldErrors: Record<string, string>;
} {
    // Axios error (e.g., API error response)
    if (isAxiosError(error)) {
        const data = error.response?.data as unknown as {
            message?: string;
            fieldErrors?: Record<string, string>;
        };
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
