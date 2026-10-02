import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import userReducer from '../../store/slices/userSlice/userSlice';
import authReducer from '../../store/slices/authSlice/authSlice';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import ProtectedRoute from './ProtectedRoute';
import type { UserDTO } from '../../types';
import { Provider } from 'react-redux';

const baseUser: UserDTO = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    roles: ['ROLE_USER'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const adminUser: UserDTO = { ...baseUser, roles: ['ROLE_USER', 'ROLE_ADMIN'] };

interface Overrides {
    isAuthenticated?: boolean;
    initialized: boolean;
    currentUser?: UserDTO | null;
}

const LocationProbe = () => {
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from ?? 'none';
    return <div>login page, from {from}</div>;
};

const renderGuard = (
    { isAuthenticated = false, initialized = true, currentUser = null }: Overrides,
    requiredRoles: string[] = []
) => {
    const store = configureStore({
        reducer: { user: userReducer, auth: authReducer },
        preloadedState: {
            user: {
                currentUser,
                isLoading: false,
                initialized,
                error: { message: null, fieldErrors: null },
            },
            auth: {
                isAuthenticated,
                isLoading: false,
                error: { message: null, fieldErrors: null },
            },
        },
    });
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/accounts']}>
                <Routes>
                    <Route
                        path="/accounts"
                        element={
                            <ProtectedRoute requiredRoles={requiredRoles}>
                                <div>protected content</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<LocationProbe />} />
                    <Route path="/unauthorized" element={<div>unauthorized page</div>} />
                </Routes>
            </MemoryRouter>
        </Provider>
    );
};

describe('ProtectedRoute', () => {
    it('shows LoadingScreen while uninitialized', () => {
        renderGuard({ initialized: false });
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.queryByText('protected content')).not.toBeInTheDocument();
        expect(screen.queryByText(/login page/)).not.toBeInTheDocument();
        expect(screen.queryByText('unauthorized page')).not.toBeInTheDocument();
    });

    it('redirects to /login and preserves the intended destination', () => {
        renderGuard({ isAuthenticated: false, initialized: true });
        expect(screen.queryByText('protected content')).not.toBeInTheDocument();
        expect(screen.getByText('login page, from /accounts')).toBeInTheDocument();
        expect(screen.queryByText('unauthorized page')).not.toBeInTheDocument();
    });

    it('renders children when authenticated', () => {
        renderGuard({
            isAuthenticated: true,
            initialized: true,
            currentUser: baseUser,
        });
        expect(screen.getByText('protected content')).toBeInTheDocument();
        expect(screen.queryByText(/login page/)).not.toBeInTheDocument();
        expect(screen.queryByText('unauthorized page')).not.toBeInTheDocument();
    });

    it('redirects to /unauthorized when the required role is missing', () => {
        renderGuard(
            {
                isAuthenticated: true,
                initialized: true,
                currentUser: baseUser,
            },
            ['ROLE_ADMIN']
        );
        expect(screen.queryByText('protected content')).not.toBeInTheDocument();
        expect(screen.queryByText(/login page/)).not.toBeInTheDocument();
        expect(screen.getByText('unauthorized page')).toBeInTheDocument();
    });

    it('renders children when the required role is present', () => {
        renderGuard(
            {
                isAuthenticated: true,
                initialized: true,
                currentUser: adminUser,
            },
            ['ROLE_ADMIN']
        );
        expect(screen.getByText('protected content')).toBeInTheDocument();
        expect(screen.queryByText(/login page/)).not.toBeInTheDocument();
        expect(screen.queryByText('unauthorized page')).not.toBeInTheDocument();
    });
});
