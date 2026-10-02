import userReducer from '../../store/slices/userSlice/userSlice';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SessionBootstrap from './SessionBootstrap';
import { configureStore } from '@reduxjs/toolkit';
import { authService } from '../../services';
import { Provider } from 'react-redux';

vi.mock('../../services', () => ({
    authService: {
        getCurrentUser: vi.fn(),
    },
}));

const mockedAuthService = vi.mocked(authService);

describe('SessionBootstrap', () => {
    beforeEach(() => {
        vi.clearAllMocks();
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
});
