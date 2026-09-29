import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import type { RegisterRequest, UserDTO, ResponseDTO } from '../../types';
import { authService } from '../authService';
import api from '../api';

// Mock the entire api module
vi.mock('../api', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

const mockedAPI = api as Mocked<typeof api>;

describe('authService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('register', () => {
        const mockData: RegisterRequest = {
            email: 'test@example.com',
            password: 'Pass123!',
            passwordConfirm: 'Pass123!',
            firstName: 'John',
            lastName: 'Doe',
        };

        const mockUser: UserDTO = {
            id: 1,
            email: mockData.email,
            firstName: mockData.firstName,
            lastName: mockData.lastName,
            roles: ['ROLE_USER'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const mockSuccessResponse: ResponseDTO<UserDTO> = {
            message: 'User registered successfully',
            data: mockUser,
            status: 201,
            timestamp: new Date().toISOString(),
        };

        it('calls api.post with /auth/register and the data', async () => {
            mockedAPI.post.mockResolvedValue({ data: mockSuccessResponse });
            const result = await authService.register(mockData);
            expect(api.post).toHaveBeenCalledTimes(1);
            expect(api.post).toHaveBeenCalledWith('/auth/register', mockData);
            expect(result).toEqual({ data: mockSuccessResponse });
        });

        it('propagates errors from api.post', async () => {
            const error = new Error('Network error');
            mockedAPI.post.mockRejectedValue(error);
            await expect(authService.register(mockData)).rejects.toThrow('Network error');
            expect(api.post).toHaveBeenCalledWith('/auth/register', mockData);
        });

        it('handles 400 validation errors with fieldErrors', async () => {
            const date = new Date().toISOString();
            const errorResponse = {
                response: {
                    status: 400,
                    data: {
                        message: 'Invalid request payload',
                        timestamp: date,
                        status: 400,
                        error: 'Validation Failed',
                        fieldErrors: {
                            email: 'Invalid email format',
                            password: 'Password must contain...',
                        },
                    },
                },
            };
            mockedAPI.post.mockRejectedValue(errorResponse);
            await expect(authService.register(mockData)).rejects.toEqual(
                expect.objectContaining({
                    response: expect.objectContaining({
                        status: 400,
                        data: expect.objectContaining({
                            message: 'Invalid request payload',
                            timestamp: date,
                            status: 400,
                            error: 'Validation Failed',
                            fieldErrors: expect.objectContaining({
                                email: 'Invalid email format',
                                password: 'Password must contain...',
                            }),
                        }),
                    }),
                })
            );
        });
    });
});
