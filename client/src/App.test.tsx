import { describe, it, expect, vi, beforeEach } from 'vitest';
import userReducer from './store/slices/userSlice/userSlice';
import authReducer from './store/slices/authSlice/authSlice';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
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
vi.mock('./layouts/MainLayout', () => ({ default: () => <div>Main Layout</div> }));

const authenticatedUser: UserDTO = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    roles: ['ROLE_USER'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const renderApp = (authenticated: boolean) => {
    const store = configureStore({
        reducer: { user: userReducer, auth: authReducer },
        preloadedState: {
            user: {
                currentUser: authenticated ? authenticatedUser : null,
                isLoading: false,
                initialized: true,
                error: { message: null, fieldErrors: null },
            },
            auth: {
                isAuthenticated: authenticated,
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
        renderApp(true);
        expect(screen.getByText('Main Layout')).toBeInTheDocument();
    });

    it('renders Login when unauthenticated', () => {
        renderApp(false);
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('renders Unauthorized when current user lacks role', () => {
        window.history.pushState({}, '', '/unauthorized');
        renderApp(true);
        expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
    });
});
