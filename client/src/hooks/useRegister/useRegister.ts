import { type AppDispatch, type RootState, register } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { validateRegister } from '../../validations';
import { type RegisterRequest } from '../../types';
import { getPasswordStrength } from '../../utils';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../useForm';
import { toast } from 'sonner';

type RegisterErrors = Partial<Record<keyof RegisterRequest, string>> & {
    general?: string;
};

export default function useRegister() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state: RootState) => state.auth);
    // Form fields
    const { values, errors, setFieldError, handleChange, handleBlur, validateForm } =
        useForm<RegisterRequest>({
            initialValues: {
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                passwordConfirm: '',
            },
            validate: validateRegister,
        });
    const [generalError, setGeneralError] = useState<string>('');
    const passwordStrength = getPasswordStrength(
        values.password,
        values.firstName,
        values.lastName,
        values.email
    );

    const clientErrors = useMemo(() => validateRegister(values), [values]);
    const isFormValid = useMemo(
        () => Object.keys(clientErrors).length === 0 && generalError.length === 0,
        [clientErrors, generalError]
    );

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (isLoading) return;
        // Run client-side validation
        const isValid = validateForm();
        if (!isValid || !isFormValid) {
            return;
        }
        // Clear any previous general error
        setGeneralError('');
        try {
            await dispatch(register(values)).unwrap();
            // registration successful, navigate to login
            toast.success('Account created!', {
                description: 'Please log in to continue.',
            });
            navigate('/login');
        } catch (error: unknown) {
            // error is the object we rejected with: { message, fieldErrors }
            const rejected = error as { message: string; fieldErrors?: Record<string, string> };
            const fieldErrors = rejected.fieldErrors ?? {};
            const hasFieldErrors = Object.keys(fieldErrors).length > 0;
            if (hasFieldErrors) {
                // Merge server-side field errors
                Object.entries(fieldErrors).forEach(([field, msg]) => {
                    setFieldError(field as keyof RegisterRequest, msg);
                });
            } else {
                // If no field errors, show the top-level message
                const message = rejected.message || 'Registration failed';
                setGeneralError(message);
                toast.error('Registration failed', { description: message });
            }
        }
    };

    const combinedErrors: RegisterErrors = { ...errors, general: generalError };

    return {
        values,
        errors: combinedErrors,
        passwordStrength,
        isLoading,
        handleSubmit,
        handleChange,
        handleBlur,
        isFormValid,
    };
}
