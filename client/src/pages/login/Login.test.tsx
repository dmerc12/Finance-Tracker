import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useLogin } from '../../hooks';
import Login from './Login';

vi.mock('../../hooks', () => ({
    useLogin: vi.fn(),
}));

const mockedUseLogin = vi.mocked(useLogin);

const baseHookReturn = {
    values: {
        email: '',
        password: '',
    },
    errors: {} as Record<string, string>,
    isLoading: false,
    isFormValid: false,
    handleSubmit: vi.fn(),
    handleChange: vi.fn(),
    handleBlur: vi.fn(),
};

const renderPage = () =>
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

describe('Login page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseLogin.mockReturnValue(baseHookReturn);
    });

    describe('rendering', () => {
        it('renders the heading and subtitle', () => {
            renderPage();
            expect(screen.getByText('Finance-Tracker')).toBeInTheDocument();
            expect(screen.getByText('Login to your account')).toBeInTheDocument();
        });

        it('renders email and password fields with accessible labels', () => {
            renderPage();
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
        });

        it('renders the submit button', () => {
            renderPage();
            expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
        });

        it('renders the register link', () => {
            renderPage();
            const link = screen.getByRole('link', { name: /register here/i });
            expect(link).toHaveAttribute('href', '/register');
        });

        it('does not render a general error alert when there is no error', () => {
            renderPage();
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });
    });

    describe('general error', () => {
        it('renders the alert when errors.general is set', () => {
            mockedUseLogin.mockReturnValue({
                ...baseHookReturn,
                errors: { general: 'Invalid email or password' },
            });
            renderPage();
            const alert = screen.getByRole('alert');
            expect(alert).toHaveTextContent('Invalid email or password');
        });
    });

    describe('field errors', () => {
        it('renders field error messages', () => {
            mockedUseLogin.mockReturnValue({
                ...baseHookReturn,
                errors: {
                    email: 'Email is required',
                    password: 'Password is required',
                },
            });
            renderPage();
            expect(screen.getByText('Email is required')).toBeInTheDocument();
            expect(screen.getByText('Password is required')).toBeInTheDocument();
        });

        it('marks the input with aria-invalid when there is an error', () => {
            mockedUseLogin.mockReturnValue({
                ...baseHookReturn,
                errors: { email: 'Email is required' },
            });
            renderPage();
            expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
        });
    });

    describe('loading state', () => {
        it('shows "Signing in..." and disables the button', () => {
            mockedUseLogin.mockReturnValue({
                ...baseHookReturn,
                isLoading: true,
            });
            renderPage();
            const button = screen.getByRole('button', { name: /signing in/i });
            expect(button).toBeDisabled();
        });
    });

    describe('submit button state', () => {
        it('is disabled when the form is not valid', () => {
            mockedUseLogin.mockReturnValue({ ...baseHookReturn, isFormValid: false });
            renderPage();
            expect(screen.getByRole('button', { name: /^login$/i })).toBeDisabled();
        });

        it('is enabled when the form is valid', () => {
            mockedUseLogin.mockReturnValue({ ...baseHookReturn, isFormValid: true });
            renderPage();
            expect(screen.getByRole('button', { name: /^login$/i })).toBeEnabled();
        });
    });

    describe('form submission', () => {
        it('calls handleSubmit when the form is submitted', async () => {
            const handleSubmit = vi.fn((e) => e.preventDefault());
            mockedUseLogin.mockReturnValue({
                ...baseHookReturn,
                isFormValid: true,
                handleSubmit,
            });
            const user = userEvent.setup();
            renderPage();
            await user.click(screen.getByRole('button', { name: /^login$/i }));
            expect(handleSubmit).toHaveBeenCalledTimes(1);
        });
    });

    describe('use input', () => {
        it('calls handleChange when the user types', async () => {
            const handleChange = vi.fn();
            mockedUseLogin.mockReturnValue({
                ...baseHookReturn,
                handleChange,
            });
            const user = userEvent.setup();
            renderPage();
            await user.type(screen.getByLabelText('Email'), 'a');
            expect(handleChange).toHaveBeenCalled();
        });
    });
});
