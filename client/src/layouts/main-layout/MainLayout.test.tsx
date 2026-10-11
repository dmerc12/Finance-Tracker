import userReducer from '../../store/slices/userSlice/userSlice';
import authReducer from '../../store/slices/authSlice/authSlice';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import type { UserDTO } from '../../types';
import { Provider } from 'react-redux';
import MainLayout from './MainLayout';

vi.mock('../../components/layout', () => ({
    Header: ({
        title,
        userName,
        onToggleSidebar,
    }: {
        title: string;
        userName?: string;
        onToggleSidebar: () => void;
    }) => (
        <header>
            <div data-testid="header-title">{title}</div>
            <div data-testid="header-user">{userName}</div>
            <button onClick={onToggleSidebar}>toggle sidebar</button>
        </header>
    ),
    Sidebar: ({ isOpen }: { isOpen: boolean }) => (
        <aside data-testid="sidebar" data-open={String(isOpen)} />
    ),
}));

const user: UserDTO = {
    id: 1,
    email: 'ada@example.com',
    firstName: 'Ada',
    lastName: 'Lovelace',
    roles: ['ROLE_USER'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const renderLayout = (path: string, currentUser: UserDTO | null = user) => {
    const store = configureStore({
        reducer: { user: userReducer, auth: authReducer },
        preloadedState: {
            user: {
                currentUser,
                isLoading: false,
                initialized: true,
                error: { message: null, fieldErrors: null },
            },
            auth: {
                isAuthenticated: currentUser !== null,
                isLoading: false,
                error: { message: null, fieldErrors: null },
            },
        },
    });
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[path]}>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<div>dashboard</div>} />
                        <Route path="/accounts" element={<div>accounts</div>} />
                        <Route path="/accounts/:id" element={<div>account details</div>} />
                        <Route path="/admin/users" element={<div>admin users</div>} />
                        <Route path="*" element={<div>catch-all</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        </Provider>
    );
};

describe('MainLayout', () => {
    describe('page title', () => {
        it('shows "Dashboard" at /', () => {
            renderLayout('/');
            expect(screen.getByTestId('header-title')).toHaveTextContent('Dashboard');
        });

        it('shows "Accounts" at /accounts', () => {
            renderLayout('/accounts');
            expect(screen.getByTestId('header-title')).toHaveTextContent('Accounts');
        });

        it('shows "Account Details" at /accounts/:id', () => {
            renderLayout('/accounts/42');
            expect(screen.getByTestId('header-title')).toHaveTextContent('Account Details');
        });

        it('shows "User Management" at /admin/users', () => {
            renderLayout('/admin/users');
            expect(screen.getByTestId('header-title')).toHaveTextContent('User Management');
        });

        it('falls back to "Finance Tracker" on an unmatched path', () => {
            renderLayout('/something-unknown');
            expect(screen.getByTestId('header-title')).toHaveTextContent('Finance Tracker');
        });
    });

    describe('user name', () => {
        it('passes the current user firstName to the header', () => {
            renderLayout('/');
            expect(screen.getByTestId('header-user')).toHaveTextContent('Ada');
        });

        it('falls back to email when firstName is missing', () => {
            renderLayout('/', { ...user, firstName: '' });
            expect(screen.getByTestId('header-user')).toHaveTextContent('ada@example.com');
        });

        it('falls back to "User" when no current user is present', () => {
            renderLayout('/', null);
            expect(screen.getByTestId('header-user')).toHaveTextContent('User');
        });
    });

    describe('sidebar toggle', () => {
        it('starts with the sidebar open', () => {
            renderLayout('/');
            expect(screen.getByTestId('sidebar')).toHaveAttribute('data-open', 'true');
        });

        it('flips the sidebar state when the header toggle is clicked', async () => {
            const clickUser = userEvent.setup();
            renderLayout('/');
            await clickUser.click(screen.getByRole('button', { name: /toggle sidebar/i }));
            expect(screen.getByTestId('sidebar')).toHaveAttribute('data-open', 'false');
        });

        it('flips the sidebar state back on a second click', async () => {
            const clickUser = userEvent.setup();
            renderLayout('/');
            const toggle = screen.getByRole('button', { name: /toggle sidebar/i });
            await clickUser.click(toggle);
            await clickUser.click(toggle);
            expect(screen.getByTestId('sidebar')).toHaveAttribute('data-open', 'true');
        });
    });

    describe('outlet', () => {
        it('renders the matched child route', () => {
            renderLayout('/accounts');
            expect(screen.getByText('accounts')).toBeInTheDocument();
        });
    });
});
