import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useRegister } from '../../hooks';
import Register from './Register';

vi.mock('../../hooks', () => ({
    useRegister: vi.fn(),
}));

const mockedUseRegister = vi.mocked(useRegister);

const baseHookReturn = {
    values: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
    },
    errors: {} as Record<string, string>,
    passwordStrength: 0,
    isLoading: false,
    isFormValid: false,
    handleSubmit: vi.fn(),
    handleChange: vi.fn(),
};

const renderPage = () =>
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    );

describe('Register page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseRegister.mockReturnValue(baseHookReturn);
    });

    describe('rendering', () => {
        it('renders the heading and subtitle', () => {
            renderPage();
            expect(screen.getByText('Finance-Tracker')).toBeInTheDocument();
            expect(screen.getByText('Create your account')).toBeInTheDocument();
        });

        it('renders all form fields with accessible labels', () => {
            renderPage();
            expect(screen.getByLabelText('First Name')).toBeInTheDocument();
            expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
            expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        });

        it('renders the submit button', () => {
            renderPage();
            expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
        });

        it('renders the login link', () => {
            renderPage();
            const loginLink = screen.getByRole('link', { name: /login here/i });
            expect(loginLink).toHaveAttribute('href', '/login');
        });

        it('does not render a general error alert when there is no error', () => {
            renderPage();
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });
    });

    describe('general error', () => {
        it('renders the alert when errors.general is set', () => {
            mockedUseRegister.mockReturnValue({
                ...baseHookReturn,
                errors: { general: 'Registration failed' },
            });
            renderPage();
            const alert = screen.getByRole('alert');
            expect(alert).toHaveTextContent('Error');
            expect(alert).toHaveTextContent('Registration failed');
        });
    });

    describe('field errors', () => {
        it('renders field error messages', () => {
            mockedUseRegister.mockReturnValue({
                ...baseHookReturn,
                errors: {
                    email: 'Email is required',
                    password: 'Password is too weak',
                },
            });
            renderPage();
            expect(screen.getByText('Email is required')).toBeInTheDocument();
            expect(screen.getByText('Password is too weak')).toBeInTheDocument();
        });

        it('marks the input with aria-invalid when there is an error', () => {
            mockedUseRegister.mockReturnValue({
                ...baseHookReturn,
                errors: { email: 'Email is required' },
            });
            renderPage();
            expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
        });
    });

    describe('password strength indicator', () => {
        it('does not render the indicator when strength is 0', () => {
            renderPage();
            expect(screen.queryByText(/password strength/i)).not.toBeInTheDocument();
        });

        it('renders the indicator when strength > 0', () => {
            mockedUseRegister.mockReturnValue({
                ...baseHookReturn,
                passwordStrength: 4,
            });
            renderPage();
            expect(screen.getByText(/password strength/i)).toBeInTheDocument();
            expect(screen.getByText('Good')).toBeInTheDocument();
        });
    });

    describe('loading state', () => {
        it('shows "Creating account..." and disables the button when loading', () => {
            mockedUseRegister.mockReturnValue({
                ...baseHookReturn,
                isLoading: true,
            });
            renderPage();
            const button = screen.getByRole('button', { name: /creating account/i });
            expect(button).toBeDisabled();
        });
    });

    describe('submit button state', () => {
        it('is disabled when the form is not valid', () => {
            mockedUseRegister.mockReturnValue({
                ...baseHookReturn,
                isFormValid: false,
            });
            renderPage();
            const button = screen.getByRole('button', { name: /create account/i });
            expect(button).toBeDisabled();
        });

        it('is enabled when the form is valid', () => {
            mockedUseRegister.mockReturnValue({
                ...baseHookReturn,
                isFormValid: true,
            });
            renderPage();
            const button = screen.getByRole('button', { name: /create account/i });
            expect(button).toBeEnabled();
        });
    });

    describe('form submission', () => {
        it('calls handleSubmit when the form is submitted', async () => {
            const handleSubmit = vi.fn((e) => e.preventDefault());
            mockedUseRegister.mockReturnValue({
                ...baseHookReturn,
                isFormValid: true,
                handleSubmit,
            });
            const user = userEvent.setup();
            renderPage();
            const button = screen.getByRole('button', { name: /create account/i });
            await user.click(button);
            expect(handleSubmit).toHaveBeenCalledTimes(1);
        });
    });

    describe('user input', () => {
        it('calls handleChange when the user types in a field', async () => {
            const handleChange = vi.fn();
            mockedUseRegister.mockReturnValue({
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
