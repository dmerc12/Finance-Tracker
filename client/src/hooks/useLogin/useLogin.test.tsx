import { screen, renderHook, act } from '@testing-library/react';
import { mockPost, mockNavigate } from '../../test/mocks';
import userEvent from '@testing-library/user-event';
import type { ChangeEvent } from 'react';
import { beforeEach } from 'vitest';
import useLogin from './useLogin';
import {
    createTestStore,
    createSubmitEvent,
    renderWithProviders,
    createHookWrapper,
} from '../../test/test-utils';

const TestComponent = () => {
    const { values, errors, handleChange, handleBlur, handleSubmit, isFormValid, isLoading } =
        useLogin();

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
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <button type="submit" disabled={!isFormValid || isLoading}>
                Submit
            </button>
            {errors.email && <p>{errors.email}</p>}
            {errors.password && <p>{errors.password}</p>}
            {errors.general && <div role="alert">{errors.general}</div>}
        </form>
    );
};

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'Pass123!');
};

const fillValidFormFields = (hook: ReturnType<typeof useLogin>) => {
    act(() => {
        hook.handleChange({
            target: { name: 'email', value: 'test@example.com' },
        } as unknown as ChangeEvent<HTMLInputElement>);
        hook.handleChange({
            target: { name: 'password', value: 'Pass123!' },
        } as unknown as ChangeEvent<HTMLInputElement>);
    });
};

const submitForm = async (hook: ReturnType<typeof useLogin>) => {
    const submitEvent = createSubmitEvent();
    await act(async () => {
        await hook.handleSubmit(submitEvent);
    });
    return submitEvent;
};

describe('useLogin', () => {
    let store: ReturnType<typeof createTestStore>;

    beforeEach(() => {
        store = createTestStore();
    });

    it('disables submit button when form is invalid', async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestComponent />, store);
        await user.type(screen.getByPlaceholderText('Email'), 'invalid');
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('navigates to dashboard on successful login', async () => {
        mockPost.mockResolvedValue({
            data: {
                message: 'Login successful',
                data: { email: 'test@example.com' },
            },
        });
        const user = userEvent.setup();
        renderWithProviders(<TestComponent />, store);
        await fillValidForm(user);
        await user.click(screen.getByRole('button'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('shows a field error after the email field is blurred', async () => {
        const user = userEvent.setup();
        renderWithProviders(<TestComponent />, store);
        const email = screen.getByPlaceholderText('Email');
        await user.type(email, 'not-an-email');
        await user.tab();
        expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    });

    it('sets a general error when the API rejects with 401', async () => {
        const errorResponse = {
            isAxiosError: true,
            response: {
                status: 401,
                data: { message: 'Invalid email or password' },
            },
        };
        mockPost.mockRejectedValue(errorResponse);
        const { result } = renderHook(() => useLogin(), {
            wrapper: createHookWrapper(store),
        });
        fillValidFormFields(result.current);
        await submitForm(result.current);
        expect(result.current.errors.general).toBe('Invalid email or password');
    });

    it('sets field errors when the API rejects with 400 and fieldErrors', async () => {
        const errorResponse = {
            isAxiosError: true,
            response: {
                status: 400,
                data: {
                    message: 'Invalid request payload',
                    fieldErrors: { email: 'Invalid email format' },
                },
            },
        };
        mockPost.mockRejectedValue(errorResponse);
        const { result } = renderHook(() => useLogin(), {
            wrapper: createHookWrapper(store),
        });
        fillValidFormFields(result.current);
        await submitForm(result.current);
        expect(result.current.errors.email).toBe('Invalid email format');
        expect(result.current.errors.general).toBe('');
    });

    it('returns early when validation fails', async () => {
        const { result } = renderHook(() => useLogin(), {
            wrapper: createHookWrapper(store),
        });
        act(() => {
            result.current.handleChange({
                target: { name: 'email', value: 'invalid' },
            } as unknown as ChangeEvent<HTMLInputElement>);
        });
        const submitEvent = createSubmitEvent();
        await act(async () => {
            await result.current.handleSubmit(submitEvent);
        });
        expect(submitEvent.preventDefault).toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
