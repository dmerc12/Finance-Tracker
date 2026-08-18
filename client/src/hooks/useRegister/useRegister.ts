import { type AppDispatch, type RootState, register } from '../../store';
import { validateRegisterRequest } from '../../validations';
import { useDispatch, useSelector } from 'react-redux';
import { type RegisterRequest } from '../../types';
import { getPasswordStrength } from '../../utils';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../useForm';

type RegisterErrors = Partial<Record<keyof RegisterRequest, string>> & {
    general?: string;
};

export default function useRegister() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state: RootState) => state.auth);
    // Form fields
    const { values, errors, setFieldError, handleChange, validateForm } = useForm<RegisterRequest>({
        initialValues: {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            passwordConfirm: '',
        },
        validate: validateRegisterRequest,
    });
    const [generalError, setGeneralError] = useState<string>('');
    const passwordStrength = getPasswordStrength(values.password);

    const isFormValid = useMemo(() => {
        const hasFieldError = Object.values(errors).some((msg) => msg && msg.length > 0);
        const hasGeneralError = generalError.length > 0;
        const allFilled = !!(
            values.email &&
            values.password &&
            values.passwordConfirm &&
            values.firstName &&
            values.lastName
        );
        return !hasFieldError && !hasGeneralError && allFilled;
    }, [errors, generalError, values]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
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
            navigate('/login');
        } catch (error: unknown) {
            // error is the object we rejected with: { message, fieldErrors }
            const rejected = error as { message: string; fieldErrors?: Record<string, string> };
            if (rejected.fieldErrors) {
                // Merge server-side field errors
                Object.entries(rejected.fieldErrors).forEach(([field, msg]) => {
                    setFieldError(field as keyof RegisterRequest, msg);
                });
            } else {
                // If no field errors, show the top-level message
                setGeneralError(rejected.message || 'Registration failed');
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
        isFormValid,
    };
}
