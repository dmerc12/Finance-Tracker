import { vi } from 'vitest';

// Mock the authService module
vi.mock('../../services/api', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

import { render, screen, renderHook, act } from '@testing-library/react';
import { configureStore, type Store } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice/authSlice.ts';
import type { ChangeEvent, SubmitEvent } from 'react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import useRegister from './useRegister';
import { Provider } from 'react-redux';
import api from '../../services/api';

const createSubmitEvent = (): SubmitEvent<HTMLFormElement> => {
    return {
        preventDefault: vi.fn(),
    } as unknown as SubmitEvent<HTMLFormElement>;
};

// Test component that uses the hook
const TestComponent = () => {
    const { values, errors, handleChange, handleSubmit, isFormValid, isLoading } = useRegister();
    return (
        <form onSubmit={handleSubmit}>
            <input name="email" placeholder="Email" value={values.email} onChange={handleChange} />
            <input
                name="firstName"
                placeholder="First Name"
                value={values.firstName}
                onChange={handleChange}
            />
            <input
                name="lastName"
                placeholder="Last Name"
                value={values.lastName}
                onChange={handleChange}
            />
            <input
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
            />
            <input
                name="passwordConfirm"
                placeholder="Confirm Password"
                value={values.passwordConfirm}
                onChange={handleChange}
            />
            <button type="submit" disabled={!isFormValid || isLoading}>
                Submit
            </button>
            {errors.general && <div role="alert">{errors.general}</div>}
        </form>
    );
};

// Helper to render with store and router
const renderWithProviders = (store: Store) => {
    return render(
        <Provider store={store}>
            <BrowserRouter>
                <TestComponent />
            </BrowserRouter>
        </Provider>
    );
};

// Helpers to fill all fields with valid data
const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Password'), 'StrongP@ss1');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'StrongP@ss1');
};

const fillValidFormFields = (hook: ReturnType<typeof useRegister>) => {
    act(() => {
        hook.handleChange({
            target: { name: 'email', value: 'test@example.com' },
        } as unknown as ChangeEvent<HTMLInputElement>);
        hook.handleChange({
            target: { name: 'firstName', value: 'John' },
        } as unknown as ChangeEvent<HTMLInputElement>);
        hook.handleChange({
            target: { name: 'lastName', value: 'Doe' },
        } as unknown as ChangeEvent<HTMLInputElement>);
        hook.handleChange({
            target: { name: 'password', value: 'StrongP@ss1' },
        } as unknown as ChangeEvent<HTMLInputElement>);
        hook.handleChange({
            target: { name: 'passwordConfirm', value: 'StrongP@ss1' },
        } as unknown as ChangeEvent<HTMLInputElement>);
    });
};

// Helper to submit the form
const submitForm = async (hook: ReturnType<typeof useRegister>) => {
    const submitEvent = createSubmitEvent();
    await act(async () => {
        await hook.handleSubmit(submitEvent);
    });
    return submitEvent;
};

// ------ Tests ------
describe('useRegister', () => {
    let store: Store;
    const mockPost = api.post as ReturnType<typeof vi.fn>;

    beforeEach(async () => {
        store = configureStore({
            reducer: { auth: authReducer },
        });
        vi.clearAllMocks();
    });

    it('disables submit button when form is invalid', async () => {
        const user = userEvent.setup();
        renderWithProviders(store);
        // Fill invalid data (missing email)
        await user.type(screen.getByPlaceholderText('Email'), 'invalid');
        await user.type(screen.getByPlaceholderText('Password'), 'short');
        await user.type(screen.getByPlaceholderText('Confirm Password'), 'short');
        await user.click(screen.getByRole('button'));
        // Submit button should be disabled because isFormValid is false
        expect(screen.getByRole('button')).toBeDisabled();
    });

    // Test successful submission
    it('navigates to login on successful registration', async () => {
        // Mock successful API call
        mockPost.mockResolvedValue({ data: { message: 'Registered' } });
        const user = userEvent.setup();
        renderWithProviders(store);
        // Fill valid data
        await fillValidForm(user);
        await user.click(screen.getByRole('button'));
        // Verify navigation
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    // Test error handling
    it('displays server field errors when registration fails', async () => {
        /// Mock API rejection with fieldErrors
        const errorResponse = {
            response: {
                data: {
                    message: 'Validation failed',
                    fieldErrors: { email: 'Email already taken' },
                },
            },
        };
        mockPost.mockRejectedValue(errorResponse);
        const user = userEvent.setup();
        renderWithProviders(store);
        // Fill valid data
        await fillValidForm(user);
        await user.click(screen.getByRole('button'));
        // Verify no error alerts appeared since fieldErrors are returned
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should return early when validation fails (direct hook call)', async () => {
        const { result } = renderHook(() => useRegister(), {
            wrapper: ({ children }) => (
                <Provider store={store}>
                    <BrowserRouter>{children}</BrowserRouter>
                </Provider>
            ),
        });
        act(() => {
            result.current.handleChange({
                target: { name: 'email', value: 'invalid' },
            } as unknown as ChangeEvent<HTMLInputElement>);
            result.current.handleChange({
                target: { name: 'password', value: 'short' },
            } as unknown as ChangeEvent<HTMLInputElement>);
            result.current.handleChange({
                target: { name: 'passwordConfirm', value: 'short' },
            } as unknown as ChangeEvent<HTMLInputElement>);
        });
        const submitEvent = createSubmitEvent();
        await act(async () => {
            await result.current.handleSubmit(submitEvent);
        });
        expect(submitEvent.preventDefault).toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(result.current.errors.general).toBe('');
    });

    it('should set general error when API rejects without fieldErrors', async () => {
        const mockError = { message: 'Custom error' };
        const mockReject = Promise.reject(mockError);
        Object.assign(mockReject, {
            unwrap: vi.fn().mockRejectedValue(mockError),
        });
        const dispatchSpy = vi
            .spyOn(store, 'dispatch')
            .mockReturnValue(mockReject as unknown as ReturnType<typeof store.dispatch>);
        const { result } = renderHook(() => useRegister(), {
            wrapper: ({ children }) => (
                <Provider store={store}>
                    <BrowserRouter>{children}</BrowserRouter>
                </Provider>
            ),
        });
        fillValidFormFields(result.current);
        await submitForm(result.current);
        expect(result.current.errors.general).toBe('Custom error');
        dispatchSpy.mockRestore();
    });

    it('should set field errors when API rejects with fieldErrors', async () => {
        const errorResponse = {
            isAxiosError: true,
            response: {
                data: {
                    message: 'Validation failed',
                    fieldErrors: { email: 'Email already taken' },
                },
            },
        };
        mockPost.mockRejectedValue(errorResponse);
        const { result } = renderHook(() => useRegister(), {
            wrapper: ({ children }) => (
                <Provider store={store}>
                    <BrowserRouter>{children}</BrowserRouter>
                </Provider>
            ),
        });
        fillValidFormFields(result.current);
        await submitForm(result.current);
        expect(result.current.errors.email).toBe('Email already taken');
        expect(result.current.errors.general).toBe('');
    });
});
