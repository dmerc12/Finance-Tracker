import authReducer, { register, clearAuthError, resetAuthState } from './authSlice';
import type { RegisterRequest, UserDTO, ResponseDTO } from '../../../types';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { authService } from '../../../services';
import { type AxiosResponse, isAxiosError } from 'axios';

vi.mock('../../../services', () => ({
    authService: {
        register: vi.fn(),
    },
}));

vi.mock('axios', async () => {
    const actual = await vi.importActual('axios');
    return {
        ...actual,
        isAxiosError: vi.fn(),
    };
});

const mockedAuthService = vi.mocked(authService);
const mockedIsAxiosError = vi.mocked(isAxiosError);

function createAxiosResponse<T>(data: T): AxiosResponse<T> {
    return {
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    } as AxiosResponse<T>;
}

describe('authSlice', () => {
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
            mockedIsAxiosError.mockImplementation((err) => err === error);
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
            mockedIsAxiosError.mockImplementation((err) => err === error);
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
            mockedIsAxiosError.mockReturnValue(false);
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
