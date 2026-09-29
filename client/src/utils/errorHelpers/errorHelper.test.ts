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
});
