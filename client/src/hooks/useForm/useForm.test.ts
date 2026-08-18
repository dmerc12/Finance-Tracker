import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';
import React from 'react';

interface TestForm {
    email: string;
    password: string;
}

describe('useForm', () => {
    const initialValues: TestForm = {
        email: '',
        password: '',
    };
    const validate = (values: TestForm): Partial<Record<keyof TestForm, string>> => {
        const errors: Partial<Record<keyof TestForm, string>> = {};
        if (!values.email) errors.email = 'Email is required';
        if (!values.password) errors.password = 'Password is required';
        return errors;
    };

    it('should initialize with the given initial values and empty errors', () => {
        const { result } = renderHook(() => useForm<TestForm>({ initialValues }));
        expect(result.current.values).toEqual(initialValues);
        expect(result.current.errors).toEqual({});
    });

    it('should update values when handleChange is called', () => {
        const { result } = renderHook(() => useForm<TestForm>({ initialValues }));
        act(() => {
            result.current.handleChange({
                target: { name: 'email', value: 'test@example.com' },
            } as React.ChangeEvent<HTMLInputElement>);
        });
        expect(result.current.values.email).toBe('test@example.com');
        expect(result.current.values.password).toBe('');
    });

    it('should set a field error with setFieldError', () => {
        const { result } = renderHook(() => useForm<TestForm>({ initialValues }));
        act(() => {
            result.current.setFieldError('email', 'Invalid email');
        });
        expect(result.current.errors.email).toBe('Invalid email');
    });

    it('should run validation and return true when valid', () => {
        const { result } = renderHook(() =>
            useForm<TestForm>({
                initialValues: { email: 'test@example.com', password: 'secret' },
                validate,
            })
        );
        let isValid: boolean;
        act(() => {
            isValid = result.current.validateForm();
        });
        expect(isValid!).toBe(true);
        expect(result.current.errors).toEqual({});
    });

    it('should run validation and return false when invalid, setting errors', () => {
        const { result } = renderHook(() =>
            useForm<TestForm>({
                initialValues: { email: '', password: '' },
                validate,
            })
        );
        let isValid: boolean;
        act(() => {
            isValid = result.current.validateForm();
        });
        expect(isValid!).toBe(false);
        expect(result.current.errors).toEqual({
            email: 'Email is required',
            password: 'Password is required',
        });
    });

    it('should clear errors after validation passes', () => {
        const { result } = renderHook(() =>
            useForm<TestForm>({
                initialValues: { email: '', password: '' },
                validate,
            })
        );
        act(() => {
            result.current.validateForm();
        });
        expect(result.current.errors).toEqual({
            email: 'Email is required',
            password: 'Password is required',
        });
        act(() => {
            result.current.handleChange({
                target: { name: 'email', value: 'test@example.com' },
            } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleChange({
                target: { name: 'password', value: 'secret' },
            } as React.ChangeEvent<HTMLInputElement>);
        });
        act(() => {
            result.current.validateForm();
        });
        expect(result.current.errors).toEqual({});
    });

    it('should allow direct setting of values and errors via setValues and setErrors', () => {
        const { result } = renderHook(() => useForm<TestForm>({ initialValues }));
        act(() => result.current.setValues({ email: 'direct@example.com', password: 'direct' }));
        expect(result.current.values).toEqual({ email: 'direct@example.com', password: 'direct' });
        act(() => result.current.setErrors({ email: 'Direct error' }));
        expect(result.current.errors).toEqual({ email: 'Direct error' });
    });

    it('should return true from validateForm if no validate function is provided', () => {
        const { result } = renderHook(() => useForm<TestForm>({ initialValues }));
        let isValid: boolean;
        act(() => {
            isValid = result.current.validateForm();
        });
        expect(isValid!).toBe(true);
        expect(result.current.errors).toEqual({});
    });
});
