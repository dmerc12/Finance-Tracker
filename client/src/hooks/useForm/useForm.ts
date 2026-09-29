import { useState, useCallback, type ChangeEvent, type FocusEvent } from 'react';

interface UseFormOptions<T> {
    initialValues: T;
    validate?: (values: T) => Partial<Record<keyof T, string>>;
}

export function useForm<T extends object>({ initialValues, validate }: UseFormOptions<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

    const validateField = useCallback(
        (name: keyof T, nextValues: T) => {
            if (!validate) return undefined;
            const allErrors = validate(nextValues);
            return allErrors[name];
        },
        [validate]
    );

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            const key = name as keyof T;
            setValues((prev) => {
                const next = { ...prev, [key]: value } as T;
                if (touched[key]) {
                    const message = validateField(key, next);
                    setErrors((prevErrors) => {
                        const merged = { ...prevErrors };
                        if (message) merged[key] = message;
                        else delete merged[key];
                        return merged;
                    });
                }
                return next;
            });
        },
        [touched, validateField]
    );

    const handleBlur = useCallback(
        (e: FocusEvent<HTMLInputElement>) => {
            const key = e.target.name as keyof T;
            setTouched((prev) => ({ ...prev, [key]: true }));
            const message = validateField(key, values);
            setErrors((prev) => {
                const merged = { ...prev };
                if (message) merged[key] = message;
                else delete merged[key];
                return merged;
            });
        },
        [validateField, values]
    );

    const setFieldError = useCallback((field: keyof T, message: string) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
    }, []);

    const validateForm = useCallback(() => {
        if (validate) {
            const newErrors = validate(values);
            setErrors(newErrors);
            const allTouched: Partial<Record<keyof T, boolean>> = {};
            for (const key of Object.keys(values) as (keyof T)[]) {
                allTouched[key] = true;
            }
            setTouched(allTouched);
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
        handleBlur,
        validateForm,
    };
}
