import { type AppDispatch, type RootState, login } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { validateLogin } from '../../validations';
import React, { useState, useMemo } from 'react';
import { type LoginRequest } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../useForm';
import { toast } from 'sonner';

type LoginErrors = Partial<Record<keyof LoginRequest, string>> & {
    general?: string;
};

export default function useLogin() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state: RootState) => state.auth);

    const { values, errors, setFieldError, handleChange, handleBlur, validateForm } =
        useForm<LoginRequest>({
            initialValues: {
                email: '',
                password: '',
            },
            validate: validateLogin,
        });

    const [generalError, setGeneralError] = useState<string>('');

    const clientErrors = useMemo(() => validateLogin(values), [values]);
    const isFormValid = useMemo(
        () => Object.keys(clientErrors).length === 0 && generalError.length === 0,
        [clientErrors, generalError]
    );

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
            toast.success('Welcome back!');
            navigate('/');
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
