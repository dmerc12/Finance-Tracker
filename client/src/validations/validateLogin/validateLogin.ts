import { type LoginRequest } from '../../types';

/**
 * Validates login credentials.
 *
 * Password complexity rules are NOT enforced here. A user whose password
 * predates the current registration rules must still be able to log in.
 * Only presence checks and email format are validated.
 */
export default function validateLogin(values: Partial<LoginRequest>) {
    const errors: Partial<Record<keyof LoginRequest, string>> = {};

    if (!values.email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!values.password) {
        errors.password = 'Password is required';
    }

    return errors;
}
