import { useState, useCallback, type ChangeEvent } from 'react';

interface UseFormOptions<T> {
    initialValues: T;
    validate?: (values: T) => Partial<Record<keyof T, string>>;
}

export function useForm<T extends object>({ initialValues, validate }: UseFormOptions<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    }, []);

    const setFieldError = useCallback((field: keyof T, message: string) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
    }, []);

    const validateForm = useCallback(() => {
        if (validate) {
            const newErrors = validate(values);
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        }
        return true;
    }, [validate, values]);

    return {
        values,
        setValues,
        errors,
        setErrors,
        setFieldError,
        handleChange,
        validateForm,
    };
}
