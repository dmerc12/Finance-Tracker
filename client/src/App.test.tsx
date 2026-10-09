import { describe, it, expect, vi, beforeEach } from 'vitest';
import userReducer from './store/slices/userSlice/userSlice';
import authReducer from './store/slices/authSlice/authSlice';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import type { UserDTO } from './types';
import App from './App';

vi.mock('./pages/login', () => ({ default: () => <div>Login Page</div> }));
vi.mock('./pages/register', () => ({ default: () => <div>Register Page</div> }));
vi.mock('./pages/Dashboard', () => ({ default: () => <div>Dashboard Page</div> }));
vi.mock('./pages/Accounts', () => ({ default: () => <div>Accounts Page</div> }));
vi.mock('./pages/AccountDetails', () => ({ default: () => <div>AccountDetails Page</div> }));
vi.mock('./pages/Transactions', () => ({ default: () => <div>Transactions Page</div> }));
vi.mock('./pages/Analytics', () => ({ default: () => <div>Analytics Page</div> }));
vi.mock('./pages/Settings', () => ({ default: () => <div>Settings Page</div> }));
vi.mock('./pages/NotFound', () => ({ default: () => <div>Not Found Page</div> }));
vi.mock('./pages/unauthorized', () => ({ default: () => <div>Unauthorized Page</div> }));
vi.mock('./pages/admin/user-management/UserManagement', () => ({
    default: () => <div>User Management Page</div>,
}));
vi.mock('./layouts/MainLayout', () => ({
    default: () => (
        <div>
            Main Layout
            <Outlet />
        </div>
    ),
}));

const regularUser: UserDTO = {
    id: 1,
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    roles: ['ROLE_USER'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const adminUser: UserDTO = {
    ...regularUser,
    id: 2,
    email: 'admin@example.com',
    roles: ['ROLE_USER', 'ROLE_ADMIN'],
};

/**
 * Renders the app with a specific user state.
 * Passing {@code null} simulates an unauthenticated session;
 * passing a {@link UserDTO} simulates an authenticated one.
 * The two slices are derived from a single argument so they
 * stay consistent with how the real app behaves.
 */
const renderApp = (user: UserDTO | null) => {
    const store = configureStore({
        reducer: { user: userReducer, auth: authReducer },
        preloadedState: {
            user: {
                currentUser: user,
                isLoading: false,
                initialized: true,
                error: { message: null, fieldErrors: null },
            },
            auth: {
                isAuthenticated: user !== null,
                isLoading: false,
                error: { message: null, fieldErrors: null },
            },
        },
    });
    return render(
        <Provider store={store}>
            <App />
        </Provider>
    );
};

describe('App', () => {
    beforeEach(() => {
        window.history.pushState({}, '', '/');
    });

    it('renders MainLayout at / when authenticated', () => {
        renderApp(regularUser);
        expect(screen.getByText('Main Layout')).toBeInTheDocument();
    });

    it('renders Login when unauthenticated', () => {
        renderApp(null);
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('renders Unauthorized when current user lacks role', () => {
        window.history.pushState({}, '', '/unauthorized');
        renderApp(regularUser);
        expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
    });

    it('redirects a ROLE_USER away from /admin/users to /unauthorized', () => {
        window.history.pushState({}, '', '/admin/users');
        renderApp(regularUser);
        expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
        expect(screen.queryByText('User Management Page')).not.toBeInTheDocument();
    });

    it('renders UserManagement for a ROLE_ADMIN at /admin/users', () => {
        window.history.pushState({}, '', '/admin/users');
        renderApp(adminUser);
        expect(screen.getByText('User Management Page')).toBeInTheDocument();
        expect(screen.queryByText('Unauthorized Page')).not.toBeInTheDocument();
    });
});
