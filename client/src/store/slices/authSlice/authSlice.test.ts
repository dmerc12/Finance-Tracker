import authReducer, { register, login, clearAuthError, resetAuthState } from './authSlice';
import { mockIsAxiosError, createAxiosResponse } from '../../../test/mocks';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { authService } from '../../../services';
import type {
    RegisterRequest,
    LoginRequest,
    LoginResponse,
    UserDTO,
    ResponseDTO,
} from '../../../types';

vi.mock('../../../services', () => ({
    authService: {
        register: vi.fn(),
        login: vi.fn(),
    },
}));

vi.mock('axios', async () => {
    const actual = await vi.importActual('axios');
    const { mockIsAxiosError } = await import('../../../test/mocks');
    return {
        ...actual,
        isAxiosError: mockIsAxiosError,
    };
});

const mockedAuthService = vi.mocked(authService);

describe('authSlice', () => {
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

        it('should handle login.pending and login.fulfilled', async () => {
            const response: ResponseDTO<LoginResponse> = {
                message: 'Login successful',
                data: mockLoginResponse,
                status: 200,
                timestamp: new Date().toISOString(),
            };
            mockedAuthService.login.mockResolvedValue(createAxiosResponse(response));
            const store = configureStore({ reducer: { auth: authReducer } });
            const action = await store.dispatch(login(mockData));
            expect(action.type).toBe(login.fulfilled.type);
            expect(action.payload).toEqual(mockLoginResponse);
            expect(store.getState().auth.isAuthenticated).toBe(true);
            expect(store.getState().auth.isLoading).toBe(false);
            expect(store.getState().auth.error.message).toBeNull();
        });

        it('should handle login.rejected with 401 invalid credentials', async () => {
            const error = {
                isAxiosError: true,
                response: {
                    status: 401,
                    data: { message: 'Invalid email or password' },
                },
            };
            mockIsAxiosError.mockReturnValue(true);
            mockedAuthService.login.mockRejectedValue(error);
            const store = configureStore({ reducer: { auth: authReducer } });
            const action = await store.dispatch(login(mockData));
            expect(action.type).toBe(login.rejected.type);
            expect(action.payload).toEqual({
                message: 'Invalid email or password',
                fieldErrors: {},
            });
            expect(store.getState().auth.isAuthenticated).toBe(false);
            expect(store.getState().auth.isLoading).toBe(false);
            expect(store.getState().auth.error.message).toBe('Invalid email or password');
        });

        it('should handle login.rejected with 400 validation fieldErrors', async () => {
            const error = {
                isAxiosError: true,
                response: {
                    status: 400,
                    data: {
                        message: 'Invalid request payload',
                        fieldErrors: { email: 'Invalid email format' },
                    },
                },
            };
            mockIsAxiosError.mockReturnValue(true);
            mockedAuthService.login.mockRejectedValue(error);
            const store = configureStore({ reducer: { auth: authReducer } });
            const action = await store.dispatch(login(mockData));
            expect(action.type).toBe(login.rejected.type);
            expect(action.payload).toEqual({
                message: 'Invalid request payload',
                fieldErrors: { email: 'Invalid email format' },
            });
            expect(store.getState().auth.error.fieldErrors).toStrictEqual({
                email: 'Invalid email format',
            });
        });

        it('should handle login.rejected with generic error', async () => {
            mockIsAxiosError.mockReturnValue(false);
            mockedAuthService.login.mockRejectedValue(new Error('Network error'));
            const store = configureStore({ reducer: { auth: authReducer } });
            const action = await store.dispatch(login(mockData));
            expect(action.type).toBe(login.rejected.type);
            expect(action.payload).toEqual({
                message: 'Network error',
                fieldErrors: {},
            });
        });
    });

    describe('register', () => {
        const mockData: RegisterRequest = {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'Pass123!',
            passwordConfirm: 'Pass123!',
        };

        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should handle register.pending and register.fulfilled', async () => {
            const mockUser: UserDTO = {
                id: 1,
                email: mockData.email,
                firstName: mockData.firstName,
                lastName: mockData.lastName,
                roles: ['ROLE_USER'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            const response: ResponseDTO<UserDTO> = {
                message: 'User registered successfully',
                data: mockUser,
                status: 201,
                timestamp: new Date().toISOString(),
            };
            mockedAuthService.register.mockResolvedValue(createAxiosResponse(response));
            const store = configureStore({ reducer: { auth: authReducer } });
            const action = await store.dispatch(register(mockData));
            expect(action.type).toBe(register.fulfilled.type);
            expect(action.payload).toBe(mockUser);
            expect(store.getState().auth.isLoading).toBe(false);
            expect(store.getState().auth.error.message).toBeNull();
            expect(store.getState().auth.error.fieldErrors).toBeNull();
            expect(store.getState().auth.isAuthenticated).toBe(false);
        });

        it('should handle register.rejected with fieldErrors', async () => {
            const error = {
                response: {
                    status: 400,
                    data: {
                        message: 'Validation failed',
                        fieldErrors: { email: 'Email already taken' },
                    },
                },
            };
            mockIsAxiosError.mockImplementation((err) => err === error);
            mockedAuthService.register.mockRejectedValue(error);
            const store = configureStore({ reducer: { auth: authReducer } });
            const action = await store.dispatch(register(mockData));
            expect(action.type).toBe(register.rejected.type);
            expect(action.payload).toEqual({
                message: 'Validation failed',
                fieldErrors: { email: 'Email already taken' },
            });
            expect(store.getState().auth.isLoading).toBe(false);
            expect(store.getState().auth.error.message).toBe('Validation failed');
            expect(store.getState().auth.error.fieldErrors).toStrictEqual({
                email: 'Email already taken',
            });
        });

        it('should handle register.rejected without fieldErrors', async () => {
            const error = {
                response: {
                    status: 409,
                    data: {
                        message: 'Email already registered: test@example.com',
                    },
                },
            };
            mockIsAxiosError.mockImplementation((err) => err === error);
            mockedAuthService.register.mockRejectedValue(error);
            const store = configureStore({ reducer: { auth: authReducer } });
            const action = await store.dispatch(register(mockData));
            expect(action.type).toBe(register.rejected.type);
            expect(action.payload).toEqual({
                message: 'Email already registered: test@example.com',
                fieldErrors: {},
            });
            expect(store.getState().auth.error.message).toBe(
                'Email already registered: test@example.com'
            );
            expect(store.getState().auth.error.fieldErrors).toStrictEqual({});
        });

        it('should handle register.rejected with generic error (network error)', async () => {
            const error = new Error('Network error');
            mockIsAxiosError.mockReturnValue(false);
            mockedAuthService.register.mockRejectedValue(error);
            const store = configureStore({ reducer: { auth: authReducer } });
            const action = await store.dispatch(register(mockData));
            expect(action.type).toBe(register.rejected.type);
            expect(action.payload).toEqual({
                message: 'Network error',
                fieldErrors: {},
            });
            expect(store.getState().auth.error.message).toBe('Network error');
            expect(store.getState().auth.error.fieldErrors).toStrictEqual({});
        });

        it('should clear error with clearAuthError', () => {
            const store = configureStore({ reducer: { auth: authReducer } });
            store.dispatch({
                type: register.rejected.type,
                payload: { message: 'Error', fieldErrors: {} },
            });
            expect(store.getState().auth.error.message).toBe('Error');
            store.dispatch(clearAuthError());
            expect(store.getState().auth.error.message).toBeNull();
            expect(store.getState().auth.error.fieldErrors).toBeNull();
        });

        it('should reset state with resetAuthState', () => {
            const store = configureStore({ reducer: { auth: authReducer } });
            store.dispatch({ type: register.pending.type });
            store.dispatch(resetAuthState());
            expect(store.getState().auth).toStrictEqual({
                isAuthenticated: false,
                isLoading: false,
                error: {
                    message: null,
                    fieldErrors: null,
                },
            });
        });
    });
});
