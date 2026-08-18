import { type RegisterRequest } from '../../types';
import { getPasswordStrength } from '../../utils';

export default function validateRegisterRequest(values: Partial<RegisterRequest>) {
    const errors: Partial<Record<keyof RegisterRequest, string>> = {};
    // Email
    if (!values.email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Please enter a valid email address';
    }
    // Password
    if (!values.password) {
        errors.password = 'Password is required';
    } else {
        const strength = getPasswordStrength(values.password);
        if (strength < 5) {
            errors.password =
                'Password must be at least 8 characters and include uppercase, lowercase, digit, and special character';
        }
    }
    // Confirm password
    if (!values.passwordConfirm) {
        errors.passwordConfirm = 'Password confirmation is required';
    } else if (values.password !== values.passwordConfirm) {
        errors.passwordConfirm = 'Passwords do not match';
    }
    // First name
    if (!values.firstName) errors.firstName = 'First name is required';
    else if (values.firstName.length > 100)
        errors.firstName = 'First name cannot exceed 100 characters';
    // Last name
    if (!values.lastName) errors.lastName = 'Last name is required';
    else if (values.lastName.length > 100)
        errors.lastName = 'Last name cannot exceed 100 characters';
    return errors;
}
