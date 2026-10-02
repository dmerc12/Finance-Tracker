import userReducer, { fetchCurrentUser, resetUserState, clearUserError } from './userSlice';
import { mockIsAxiosError, createAxiosResponse } from '../../../test/mocks';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { UserDTO, ResponseDTO } from '../../../types';
import { configureStore } from '@reduxjs/toolkit';
import { authService } from '../../../services';

vi.mock('../../../services', () => ({
    authService: {
        getCurrentUser: vi.fn(),
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

const mockUser: UserDTO = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    roles: ['ROLE_USER'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

describe('userSlice', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('fetchCurrentUser', () => {
        it('should handle fetchCurrentUser.pending and .fulfilled', async () => {
            const response: ResponseDTO<UserDTO> = {
                message: 'Authenticated user',
                data: mockUser,
                status: 200,
                timestamp: new Date().toISOString(),
            };
            mockedAuthService.getCurrentUser.mockResolvedValue(createAxiosResponse(response));
            const store = configureStore({ reducer: { user: userReducer } });
            const action = await store.dispatch(fetchCurrentUser());
            expect(action.type).toBe(fetchCurrentUser.fulfilled.type);
            expect(action.payload).toEqual(mockUser);
            expect(store.getState().user.currentUser).toEqual(mockUser);
            expect(store.getState().user.isLoading).toBe(false);
            expect(store.getState().user.initialized).toBe(true);
            expect(store.getState().user.error.message).toBeNull();
        });

        it('should leave initialized false while pending', () => {
            const store = configureStore({ reducer: { user: userReducer } });
            store.dispatch({ type: fetchCurrentUser.pending.type });
            expect(store.getState().user.isLoading).toBe(true);
            expect(store.getState().user.initialized).toBe(false);
            expect(store.getState().user.currentUser).toBeNull();
            expect(store.getState().user.error.message).toBeNull();
        });

        it('should handle fetchCurrentUser.rejected with 401 unauthenticated', async () => {
            const error = {
                response: {
                    status: 401,
                    data: { message: 'Authentication required' },
                },
            };
            mockIsAxiosError.mockReturnValue(true);
            mockedAuthService.getCurrentUser.mockRejectedValue(error);
            const store = configureStore({ reducer: { user: userReducer } });
            const action = await store.dispatch(fetchCurrentUser());
            expect(action.type).toBe(fetchCurrentUser.rejected.type);
            expect(action.payload).toEqual({
                message: 'Authentication required',
                fieldErrors: {},
            });
            expect(store.getState().user.currentUser).toBeNull();
            expect(store.getState().user.isLoading).toBe(false);
            expect(store.getState().user.initialized).toBe(true);
            expect(store.getState().user.error.message).toBe('Authentication required');
        });

        it('should handle fetchCurrentUser.rejected with generic error (network error)', async () => {
            mockIsAxiosError.mockReturnValue(false);
            mockedAuthService.getCurrentUser.mockRejectedValue(new Error('Network error'));
            const store = configureStore({ reducer: { user: userReducer } });
            const action = await store.dispatch(fetchCurrentUser());
            expect(action.type).toBe(fetchCurrentUser.rejected.type);
            expect(action.payload).toEqual({
                message: 'Network error',
                fieldErrors: {},
            });
            expect(store.getState().user.currentUser).toBeNull();
            expect(store.getState().user.initialized).toBe(true);
            expect(store.getState().user.error.message).toBe('Network error');
        });
    });

    describe('reducers', () => {
        it('should clear error with clearUserError', () => {
            const store = configureStore({ reducer: { user: userReducer } });
            store.dispatch({
                type: fetchCurrentUser.rejected.type,
                payload: { message: 'Boom', fieldError: {} },
            });
            expect(store.getState().user.error.message).toBe('Boom');
            store.dispatch(clearUserError());
            expect(store.getState().user.error.message).toBeNull();
        });

        it('should reset state with resetUserState', () => {
            const store = configureStore({ reducer: { user: userReducer } });
            store.dispatch({
                type: fetchCurrentUser.fulfilled.type,
                payload: mockUser,
            });
            expect(store.getState().user.currentUser).toEqual(mockUser);
            expect(store.getState().user.initialized).toBe(true);
            store.dispatch(resetUserState());
            expect(store.getState().user).toStrictEqual({
                currentUser: null,
                isLoading: false,
                initialized: false,
                error: { message: null, fieldErrors: null },
            });
        });
    });
});
