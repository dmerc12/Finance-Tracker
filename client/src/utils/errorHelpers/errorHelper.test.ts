import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getErrorData } from '../errorHelpers';
import { isAxiosError } from 'axios';

vi.mock('axios', () => ({
    isAxiosError: vi.fn(),
}));

const mockedIsAxiosError = vi.mocked(isAxiosError);

describe('getErrorData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should handle Axios error with response.data containing message and fieldErrors', () => {
        const mockError = {
            response: {
                data: {
                    message: 'Validation failed',
                    fieldErrors: { email: 'Email already taken' },
                },
            },
        };
        mockedIsAxiosError.mockReturnValue(true);
        const result = getErrorData(mockError);
        expect(result).toEqual({
            message: 'Validation failed',
            fieldErrors: { email: 'Email already taken' },
        });
        expect(isAxiosError).toHaveBeenCalledWith(mockError);
    });

    it('should handle Axios errors with response.data but no message/fieldErrors', () => {
        const mockError = {
            response: {
                data: {},
            },
        };
        mockedIsAxiosError.mockReturnValue(true);
        const result = getErrorData(mockError);
        expect(result).toEqual({
            message: 'An error occurred',
            fieldErrors: {},
        });
    });

    it('should handle Axios errors without response.data', () => {
        const mockError = {
            response: {},
        };
        mockedIsAxiosError.mockReturnValue(true);
        const result = getErrorData(mockError);
        expect(result).toEqual({
            message: 'An error occurred',
            fieldErrors: {},
        });
    });

    it('should handle plain Error objects (non-Axios)', () => {
        const error = new Error('Network error');
        mockedIsAxiosError.mockReturnValue(false);
        const result = getErrorData(error);
        expect(result).toEqual({
            message: 'Network error',
            fieldErrors: {},
        });
    });

    it('should handle non-Error values (string)', () => {
        const error = 'Something went wrong';
        mockedIsAxiosError.mockReturnValue(false);
        const result = getErrorData(error);
        expect(result).toEqual({
            message: 'An unexpected error occurred',
            fieldErrors: {},
        });
    });

    it('should handle non-Error values (null)', () => {
        const error = null;
        mockedIsAxiosError.mockReturnValue(false);
        const result = getErrorData(error);
        expect(result).toEqual({
            message: 'An unexpected error occurred',
            fieldErrors: {},
        });
    });

    it('should handle non-Error values (undefined)', () => {
        const error = undefined;
        mockedIsAxiosError.mockReturnValue(false);
        const result = getErrorData(error);
        expect(result).toEqual({
            message: 'An unexpected error occurred',
            fieldErrors: {},
        });
    });

    it('should return a timeout message when the request exceeded its budget', () => {
        const error = { isAxiosError: true, code: 'ECONNABORTED' };
        mockedIsAxiosError.mockReturnValue(true);
        const result = getErrorData(error);
        expect(result.message).toContain('took too long');
        expect(result.fieldErrors).toEqual({});
    });

    it('should return a network message when no response was received', () => {
        const error = { isAxiosError: true, code: 'ERR_NETWORK' };
        mockedIsAxiosError.mockReturnValue(true);
        const result = getErrorData(error);
        expect(result.message).toContain('Unable to reach the server');
        expect(result.fieldErrors).toEqual({});
    });

    it('should return a permission message for 403 with no body', () => {
        const error = { isAxiosError: true, response: { status: 403, data: {} } };
        mockedIsAxiosError.mockReturnValue(true);
        const result = getErrorData(error);
        expect(result.message).toContain("don't have permission");
    });

    it('should prefer the server-provided message on 403', () => {
        const error = {
            isAxiosError: true,
            response: { status: 403, data: { message: 'Admin only' } },
        };
        mockedIsAxiosError.mockReturnValue(true);
        const result = getErrorData(error);
        expect(result.message).toBe('Admin only');
    });

    it('should return a server-error message for 5xx with no body', () => {
        const error = { isAxiosError: true, response: { status: 500, data: {} } };
        mockedIsAxiosError.mockReturnValue(true);
        const result = getErrorData(error);
        expect(result.message).toContain('server encountered an error');
    });

    it('should prefer the server-provided message on 5xx', () => {
        const error = {
            isAxiosError: true,
            response: { status: 504, data: { message: 'Down for maintenance' } },
        };
        mockedIsAxiosError.mockReturnValue(true);
        const result = getErrorData(error);
        expect(result.message).toBe('Down for maintenance');
    });
});
