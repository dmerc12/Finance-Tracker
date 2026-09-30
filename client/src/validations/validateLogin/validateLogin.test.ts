import { describe, it, expect } from 'vitest';
import validateLogin from './validateLogin';

describe('validateLogin', () => {
    const validValues = {
        email: 'test@example.com',
        password: 'anything',
    };

    it('returns empty object for valid input', () => {
        expect(validateLogin(validValues)).toEqual({});
    });

    it('requires email', () => {
        expect(validateLogin({ ...validValues, email: '' })).toHaveProperty('email');
    });

    it('validates email format', () => {
        expect(validateLogin({ ...validValues, email: 'invalid' })).toHaveProperty('email');
    });

    it('requires password', () => {
        expect(validateLogin({ ...validValues, password: '' })).toHaveProperty('password');
    });

    it('does not enforce password complexity', () => {
        expect(validateLogin({ email: 'a@b.com', password: 'old' })).toEqual({});
    });

    it('returns both errors when both fields are empty', () => {
        const errors = validateLogin({ email: '', password: '' });
        expect(errors).toHaveProperty('email');
        expect(errors).toHaveProperty('password');
    });

    it('handles undefined values gracefully', () => {
        const errors = validateLogin({});
        expect(errors).toHaveProperty('email');
        expect(errors).toHaveProperty('password');
    });
});
