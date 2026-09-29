import { type RegisterRequest } from '../../types';
import { getPasswordStrength } from '../../utils';

export default function validateRegister(values: Partial<RegisterRequest>) {
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
        const strength = getPasswordStrength(
            values.password,
            values.firstName,
            values.lastName,
            values.email
        );
        if (strength < 6) {
            errors.password = "Password doesn't meet the requirements yet";
        }
    }
    // Confirm password
    if (!values.passwordConfirm) {
        errors.passwordConfirm = 'Please confirm your password';
    } else if (values.password !== values.passwordConfirm) {
        errors.passwordConfirm = 'Passwords do not match';
    }
    // First name
    if (!values.firstName) errors.firstName = 'First name is required';
    else if (values.firstName.length > 100)
        errors.firstName = 'First name must be 100 characters or fewer';
    // Last name
    if (!values.lastName) errors.lastName = 'Last name is required';
    else if (values.lastName.length > 100)
        errors.lastName = 'Last name must be 100 characters or fewer';
    return errors;
}
