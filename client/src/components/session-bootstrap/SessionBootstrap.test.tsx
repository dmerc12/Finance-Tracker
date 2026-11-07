import userReducer from '../../store/slices/userSlice/userSlice';
import authReducer from '../../store/slices/authSlice/authSlice';
import { authService, ensureCsrfCookie } from '../../services';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import SessionBootstrap from './SessionBootstrap';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

vi.mock('../../services', () => ({
    authService: {
        getCurrentUser: vi.fn(),
    },
    ensureCsrfCookie: vi.fn().mockResolvedValue(undefined),
}));

let capturedHandler: ((event: { type: string }) => void) | null = null;
vi.mock('../../utils', async () => {
    const actual = await vi.importActual<typeof import('../../utils')>('../../utils');
    return {
        ...actual,
        subscribeToAuthEvents: (handler: (event: { type: string }) => void) => {
            capturedHandler = handler;
            return () => {
                capturedHandler = null;
            };
        },
    };
});

const mockedAuthService = vi.mocked(authService);
const mockedEnsureCsrfCookie = vi.mocked(ensureCsrfCookie);

const seededUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Ada',
    lastName: 'Lovelace',
    roles: ['ROLE_USER'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

describe('SessionBootstrap', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        capturedHandler = null;
        mockedAuthService.getCurrentUser.mockReturnValue(new Promise(() => {}));
    });

    it('dispatches fetchCurrentUser on mount when not initialized', () => {
        const store = configureStore({ reducer: { user: userReducer } });
        render(
            <Provider store={store}>
                <SessionBootstrap>
                    <div>child</div>
                </SessionBootstrap>
            </Provider>
        );
        expect(store.getState().user.isLoading).toBe(true);
        expect(store.getState().user.initialized).toBe(false);
    });

    it('does not dispatch when already initialized', () => {
        const store = configureStore({
            reducer: { user: userReducer },
            preloadedState: {
                user: {
                    currentUser: null,
                    isLoading: false,
                    initialized: true,
                    error: { message: null, fieldErrors: null },
                },
            },
        });
        const dispatchSpy = vi.spyOn(store, 'dispatch');
        render(
            <Provider store={store}>
                <SessionBootstrap>
                    <div>child</div>
                </SessionBootstrap>
            </Provider>
        );
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('renders children', () => {
        const store = configureStore({ reducer: { user: userReducer } });
        render(
            <Provider store={store}>
                <SessionBootstrap>
                    <div>child</div>
                </SessionBootstrap>
            </Provider>
        );
        expect(screen.getByText('child')).toBeInTheDocument();
    });

    describe('CSRF priming', () => {
        it('calls ensureCsrfCookie on mount', () => {
            const store = configureStore({ reducer: { user: userReducer } });
            render(
                <Provider store={store}>
                    <SessionBootstrap>
                        <div>child</div>
                    </SessionBootstrap>
                </Provider>
            );
            expect(mockedEnsureCsrfCookie).toHaveBeenCalledTimes(1);
        });

        it('calls ensureCsrfCookie even when the user session is already initialized', () => {
            const store = configureStore({
                reducer: { user: userReducer },
                preloadedState: {
                    user: {
                        currentUser: seededUser,
                        isLoading: false,
                        initialized: true,
                        error: { message: null, fieldErrors: null },
                    },
                },
            });
            render(
                <Provider store={store}>
                    <SessionBootstrap>
                        <div>child</div>
                    </SessionBootstrap>
                </Provider>
            );
            expect(mockedEnsureCsrfCookie).toHaveBeenCalledTimes(1);
        });

        it('logs but does not throw when CSRF priming fails', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockedEnsureCsrfCookie.mockRejectedValueOnce(new Error('network down'));
            const store = configureStore({ reducer: { user: userReducer } });
            render(
                <Provider store={store}>
                    <SessionBootstrap>
                        <div>child</div>
                    </SessionBootstrap>
                </Provider>
            );
            await act(async () => {
                await Promise.resolve();
            });
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Failed to establish CSRF cookie',
                expect.any(Error)
            );
            expect(screen.getByText('child')).toBeInTheDocument();
            consoleErrorSpy.mockRestore();
        });

        it('does not re-prime on rerender', async () => {
            const store = configureStore({ reducer: { user: userReducer } });
            const { rerender } = render(
                <Provider store={store}>
                    <SessionBootstrap>
                        <div>child</div>
                    </SessionBootstrap>
                </Provider>
            );
            rerender(
                <Provider store={store}>
                    <SessionBootstrap>
                        <div>rerendered</div>
                    </SessionBootstrap>
                </Provider>
            );
            expect(mockedEnsureCsrfCookie).toHaveBeenCalledTimes(1);
        });
    });

    describe('cross-tab logout', () => {
        it('resets auth and user state when another tab broadcasts logout', () => {
            const store = configureStore({
                reducer: { user: userReducer, auth: authReducer },
                preloadedState: {
                    user: {
                        currentUser: seededUser,
                        isLoading: false,
                        initialized: true,
                        error: { message: null, fieldErrors: null },
                    },
                    auth: {
                        isAuthenticated: true,
                        isLoading: false,
                        error: { message: null, fieldErrors: null },
                    },
                },
            });
            render(
                <Provider store={store}>
                    <SessionBootstrap>
                        <div>child</div>
                    </SessionBootstrap>
                </Provider>
            );
            act(() => {
                capturedHandler?.({ type: 'logout' });
            });
            expect(store.getState().auth.isAuthenticated).toBe(false);
            expect(store.getState().user.currentUser).toBeNull();
            expect(store.getState().user.initialized).toBe(true);
        });

        it('ignores unrelated event types', () => {
            const store = configureStore({
                reducer: { user: userReducer, auth: authReducer },
                preloadedState: {
                    user: {
                        currentUser: seededUser,
                        isLoading: false,
                        initialized: true,
                        error: { message: null, fieldErrors: null },
                    },
                    auth: {
                        isAuthenticated: true,
                        isLoading: false,
                        error: { message: null, fieldErrors: null },
                    },
                },
            });
            render(
                <Provider store={store}>
                    <SessionBootstrap>
                        <div>child</div>
                    </SessionBootstrap>
                </Provider>
            );
            act(() => {
                capturedHandler?.({ type: 'something-else' });
            });
            expect(store.getState().auth.isAuthenticated).toBe(true);
            expect(store.getState().user.currentUser).toEqual(seededUser);
            expect(store.getState().user.initialized).toBe(true);
        });
    });
});
