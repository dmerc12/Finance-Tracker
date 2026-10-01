import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import { mockPost, mockGet } from '../../test/mocks';
import { authService } from '../authService';
import api from '../api';
import type {
    RegisterRequest,
    UserDTO,
    ResponseDTO,
    LoginRequest,
    LoginResponse,
} from '../../types';

// Mock the entire api module
vi.mock('../api', () => ({
    default: {
        post: mockPost,
        get: mockGet,
    },
}));

const mockedAPI = api as Mocked<typeof api>;

describe('authService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('login', () => {
        const mockData: LoginRequest = {
            email: 'test@example.com',
            password: 'Pass123!',
        };

        const mockLoginResponse: LoginResponse = {
            accessToken: 'access.jwt.token',
            refreshToken: 'refresh.jwt.token',
            email: mockData.email,
            firstName: 'John',
            lastName: 'Doe',
            roles: ['ROLE_USER'],
        };

        const mockSuccessResponse: ResponseDTO<LoginResponse> = {
            message: 'Login successful',
            data: mockLoginResponse,
            status: 200,
            timestamp: new Date().toISOString(),
        };

        it('calls api.post with /auth/login and the credentials', async () => {
            mockedAPI.post.mockResolvedValue({ data: mockSuccessResponse });
            const result = await authService.login(mockData);
            expect(mockedAPI.post).toHaveBeenCalledTimes(1);
            expect(mockedAPI.post).toHaveBeenCalledWith('/auth/login', mockData);
            expect(result).toEqual({ data: mockSuccessResponse });
        });

        it('propagates network errors', async () => {
            const error = new Error('Network error');
            mockedAPI.post.mockRejectedValue(error);
            await expect(authService.login(mockData)).rejects.toThrow('Network error');
            expect(mockedAPI.post).toHaveBeenCalledWith('/auth/login', mockData);
        });

        it('propagates 401 invalid-credentials errors', async () => {
            const errorResponse = {
                response: {
                    status: 401,
                    data: {
                        message: 'Invalid email or password',
                        timestamp: new Date().toISOString(),
                        status: 401,
                        error: 'Unauthorized',
                    },
                },
            };
            mockedAPI.post.mockRejectedValue(errorResponse);
            await expect(authService.login(mockData)).rejects.toEqual(
                expect.objectContaining({
                    response: expect.objectContaining({
                        status: 401,
                        data: expect.objectContaining({
                            message: 'Invalid email or password',
                            error: 'Unauthorized',
                        }),
                    }),
                })
            );
        });
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

    describe('getCurrentUser', () => {
        const mockUser: UserDTO = {
            id: 1,
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            roles: ['ROLE_USER'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const mockSuccessResponse: ResponseDTO<UserDTO> = {
            message: 'Authenticated user',
            data: mockUser,
            status: 200,
            timestamp: new Date().toISOString(),
        };

        it('calls api.get with /auth/me and no payload', async () => {
            mockedAPI.get.mockResolvedValue({ data: mockSuccessResponse });
            const result = await authService.getCurrentUser();
            expect(mockedAPI.get).toHaveBeenCalledTimes(1);
            expect(mockedAPI.get).toHaveBeenCalledWith('/auth/me');
            expect(result).toEqual({ data: mockSuccessResponse });
        });

        it('propagates 401 when the session is unauthenticated', async () => {
            const errorResponse = {
                response: {
                    status: 401,
                    data: {
                        message: 'Authentication required',
                        timestamp: new Date().toISOString(),
                        status: 401,
                        error: 'Unauthorized',
                    },
                },
            };
            mockedAPI.get.mockRejectedValue(errorResponse);
            await expect(authService.getCurrentUser()).rejects.toEqual(
                expect.objectContaining({
                    response: expect.objectContaining({
                        status: 401,
                        data: expect.objectContaining({
                            message: 'Authentication required',
                            error: 'Unauthorized',
                        }),
                    }),
                })
            );
        });

        it('propagates network errors', async () => {
            const error = new Error('Network error');
            mockedAPI.get.mockRejectedValue(error);
            await expect(authService.getCurrentUser()).rejects.toThrow('Network error');
            expect(mockedAPI.get).toHaveBeenCalledWith('/auth/me');
        });
    });
});
