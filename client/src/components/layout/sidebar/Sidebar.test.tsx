import userReducer from '../../../store/slices/userSlice/userSlice';
import authReducer from '../../../store/slices/authSlice/authSlice';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import type { UserDTO } from '../../../types';
import { Provider } from 'react-redux';
import Sidebar from './Sidebar';

const mockHandleLogout = vi.fn();

vi.mock('../../../hooks', () => ({
    useLogout: () => ({ handleLogout: mockHandleLogout }),
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
    roles: ['ROLE_USER', 'ROLE_ADMIN'],
};

const renderSidebar = (user: UserDTO | null) => {
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
            <MemoryRouter initialEntries={['/']}>
                <Sidebar isOpen={true} />
            </MemoryRouter>
        </Provider>
    );
};

describe('Sidebar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('base navigation', () => {
        it('renders the standard nav items for a regular user', () => {
            renderSidebar(regularUser);
            expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /accounts/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /transactions/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /analytics/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
        });
    });

    describe('admin link', () => {
        it('does not render the Users link for a regular user', () => {
            renderSidebar(regularUser);
            expect(screen.queryByRole('link', { name: /^users$/i })).not.toBeInTheDocument();
        });

        it('renders the Users link for an admin', () => {
            renderSidebar(adminUser);
            const usersLink = screen.getByRole('link', { name: /^users$/i });
            expect(usersLink).toBeInTheDocument();
            expect(usersLink).toHaveAttribute('href', '/admin/users');
        });

        it('does not render the Users link when no user is loaded', () => {
            renderSidebar(null);
            expect(screen.queryByRole('link', { name: /^users$/i })).not.toBeInTheDocument();
        });
    });

    describe('logout', () => {
        it('renders the logout button', () => {
            renderSidebar(regularUser);
            expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
        });

        it('calls handleLogout when the logout button is clicked', async () => {
            const user = userEvent.setup();
            renderSidebar(regularUser);
            await user.click(screen.getByRole('button', { name: /logout/i }));
            expect(mockHandleLogout).toHaveBeenCalledTimes(1);
        });
    });
});
