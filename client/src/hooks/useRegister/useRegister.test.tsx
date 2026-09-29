import { screen, renderHook, act } from '@testing-library/react';
import { mockPost, mockNavigate } from '../../test/mocks';
import userEvent from '@testing-library/user-event';
import type { ChangeEvent } from 'react';
import useRegister from './useRegister';
import { beforeEach } from 'vitest';
import {
    createTestStore,
    createSubmitEvent,
    renderWithProviders,
    createHookWrapper,
} from '../../test/test-utils';

const TestComponent = () => {
    const { values, errors, handleChange, handleBlur, handleSubmit, isFormValid, isLoading } =
        useRegister();
    return (
        <form onSubmit={handleSubmit}>
            <input
                name="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <input
                name="firstName"
                placeholder="First Name"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <input
                name="lastName"
                placeholder="Last Name"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <input
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <input
                name="passwordConfirm"
                placeholder="Confirm Password"
                value={values.passwordConfirm}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <button type="submit" disabled={!isFormValid || isLoading}>
                Submit
            </button>
            {errors.email && <p>{errors.email}</p>}
            {errors.firstName && <p>{errors.firstName}</p>}
            {errors.lastName && <p>{errors.lastName}</p>}
            {errors.password && <p>{errors.password}</p>}
            {errors.passwordConfirm && <p>{errors.passwordConfirm}</p>}
            {errors.general && <div role="alert">{errors.general}</div>}
        </form>
    );
};

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

const submitForm = async (hook: ReturnType<typeof useRegister>) => {
    const submitEvent = createSubmitEvent();
    await act(async () => {
        await hook.handleSubmit(submitEvent);
    });
    return submitEvent;
};

describe('useRegister', () => {
    let store: ReturnType<typeof createTestStore>;

    beforeEach(async () => {
        store = createTestStore();
    });

    it('disables submit button when form is invalid', async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestComponent />, store);
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
        renderWithProviders(<TestComponent />, store);
        // Fill valid data
        await fillValidForm(user);
        await user.click(screen.getByRole('button'));
        // Verify navigation
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should return early when validation fails (direct hook call)', async () => {
        const { result } = renderHook(() => useRegister(), {
            wrapper: createHookWrapper(store),
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
            wrapper: createHookWrapper(store),
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
            wrapper: createHookWrapper(store),
        });
        fillValidFormFields(result.current);
        await submitForm(result.current);
        expect(result.current.errors.email).toBe('Email already taken');
        expect(result.current.errors.general).toBe('');
    });

    it('keeps the submit button disabled when email is invalid but all fields are filled', async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestComponent />, store);
        await user.type(screen.getByPlaceholderText('Email'), 'not-an-email');
        await user.type(screen.getByPlaceholderText('First Name'), 'John');
        await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
        await user.type(screen.getByPlaceholderText('Password'), 'StrongP@ss1');
        await user.type(screen.getByPlaceholderText('Confirm Password'), 'StrongP@ss1');
        expect(screen.getByRole('button')).toBeDisabled();
    });

    describe('live validation', () => {
        it('shows an email error after the email field is blurred', async () => {
            const user = userEvent.setup();
            renderWithProviders(<TestComponent />, store);
            const email = screen.getByPlaceholderText('Email');
            await user.type(email, 'not-an-email');
            await user.tab();
            expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
        });

        it('clears the email error as the user fixes it', async () => {
            const user = userEvent.setup();
            renderWithProviders(<TestComponent />, store);
            const email = screen.getByPlaceholderText('Email');
            await user.type(email, 'not-an-email');
            await user.tab();
            expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
            await user.clear(email);
            await user.click(email);
            await user.type(email, 'x@y.com');
            expect(screen.queryByText(/valid email address/i)).not.toBeInTheDocument();
        });

        it('shows a required error for an empty password field after blur', async () => {
            const user = userEvent.setup();
            renderWithProviders(<TestComponent />, store);
            const password = screen.getByPlaceholderText('Password');
            await user.click(password);
            await user.tab();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });
    });
});
