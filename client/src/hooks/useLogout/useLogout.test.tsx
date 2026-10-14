import authReducer from '../../store/slices/authSlice/authSlice';
import userReducer from '../../store/slices/userSlice/userSlice';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { mockNavigate } from '../../test/mocks';
import { broadcastLogout } from '../../utils';
import { authService } from '../../services';
import { Provider } from 'react-redux';
import useLogout from './useLogout';

vi.mock('../../services', () => ({
    authService: {
        logout: vi.fn(),
    },
}));

vi.mock('../../utils', async () => {
    const actual = await vi.importActual<typeof import('../../utils')>('../../utils');
    return {
        ...actual,
        broadcastLogout: vi.fn(),
    };
});

const mockedAuthService = vi.mocked(authService);
const mockedBroadcastLogout = vi.mocked(broadcastLogout);

const seededUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Ada',
    lastName: 'Lovelace',
    roles: ['ROLE_USER'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const renderLogout = () => {
    const store = configureStore({
        reducer: { auth: authReducer, user: userReducer },
        preloadedState: {
            auth: {
                isAuthenticated: true,
                isLoading: false,
                error: { message: null, fieldErrors: null },
            },
            user: {
                currentUser: seededUser,
                isLoading: false,
                initialized: true,
                error: { message: null, fieldErrors: null },
            },
        },
    });

    const utils = renderHook(() => useLogout(), {
        wrapper: ({ children }) => (
            <Provider store={store}>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });

    return { store, ...utils };
};

const performLogout = async () => {
    const { result, store } = renderLogout();
    await act(async () => {
        await result.current.handleLogout();
    });
    return { result, store };
};

const expectLoggedOut = (store: ReturnType<typeof renderLogout>['store']) => {
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().user.currentUser).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
};

describe('useLogout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('clears auth and user state, then navigates to /login', async () => {
        mockedAuthService.logout.mockResolvedValue({
            data: { message: 'Logged out successfully' },
        } as never);
        const { store } = await performLogout();
        expectLoggedOut(store);
    });

    it('still logs out locally when the API call fails', async () => {
        mockedAuthService.logout.mockRejectedValue(new Error('Network error'));
        const { store } = await performLogout();
        expectLoggedOut(store);
    });

    it('broadcasts a logout event for other tabs', async () => {
        mockedAuthService.logout.mockResolvedValue({
            data: { message: 'Logged out successfully' },
        } as never);
        await performLogout();
        expect(mockedBroadcastLogout).toHaveBeenCalledTimes(1);
    });

    it('keeps user.initialized true so SessionBootstrap does not refire', async () => {
        mockedAuthService.logout.mockResolvedValue({
            data: { message: 'Logged out successfully' },
        } as never);
        const { store } = await performLogout();
        expect(store.getState().user.initialized).toBe(true);
    });
});
