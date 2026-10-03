import React, { useState, useMemo, useCallback, type ChangeEvent } from 'react';
import { type AppDispatch, type RootState, login } from '../../store';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { validateLogin } from '../../validations';
import { type LoginRequest } from '../../types';
import { fetchCurrentUser } from '../../store';
import { useForm } from '../useForm';
import { toast } from 'sonner';

type LoginErrors = Partial<Record<keyof LoginRequest, string>> & {
    general?: string;
};

/**
 * Orchestrates the login form: validation, submission, error handling,
 * post-login identity population, and redirect.
 *
 * <p>On success the {@code login} thunk is awaited, then {@code fetchCurrentUser}
 * is dispatched {fire-and-forget} so downstream guards see the user without a
 * second {@code /auth/me} round-trip.
 * The user is redirected to {@code location.state.from} if a guard sent them here,
 * otherwise to {@code /}.
 */
export default function useLogin() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading } = useSelector((state: RootState) => state.auth);

    const {
        values,
        errors,
        setFieldError,
        handleChange: formHandleChange,
        handleBlur,
        validateForm,
    } = useForm<LoginRequest>({
        initialValues: {
            email: '',
            password: '',
        },
        validate: validateLogin,
    });

    const [generalError, setGeneralError] = useState<string>('');

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setGeneralError('');
            formHandleChange(e);
        },
        [formHandleChange]
    );

    const clientErrors = useMemo(() => validateLogin(values), [values]);
    const isFormValid = useMemo(() => Object.keys(clientErrors).length === 0, [clientErrors]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (isLoading) return;
        const isValid = validateForm();
        if (!isValid || !isFormValid) {
            return;
        }
        setGeneralError('');
        try {
            await dispatch(login(values)).unwrap();
            dispatch(fetchCurrentUser());
            toast.success('Welcome back!');
            const from = (location.state as { from?: string } | null)?.from ?? '/';
            navigate(from, { replace: true });
        } catch (error: unknown) {
            const rejected = error as { message: string; fieldErrors?: Record<string, string> };
            const fieldErrors = rejected.fieldErrors ?? {};
            const hasFieldErrors = Object.keys(fieldErrors).length > 0;
            if (hasFieldErrors) {
                Object.entries(fieldErrors).forEach(([field, msg]) => {
                    setFieldError(field as keyof LoginRequest, msg);
                });
            } else {
                const message = rejected.message || 'Login failed';
                setGeneralError(message);
                toast.error('Login failed', { description: message });
            }
        }
    };

    const combinedErrors: LoginErrors = { ...errors, general: generalError };

    return {
        values,
        errors: combinedErrors,
        isLoading,
        handleSubmit,
        handleChange,
        handleBlur,
        isFormValid,
    };
}
