import type { AccountFormData } from './AccountForm';

export default function validate(formData: AccountFormData): {
    isValid: boolean;
    errors: Record<string, string>;
} {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
        errors.name = 'Account name is required';
    }
    if (formData.balance < 0) {
        errors.balance = 'Balance cannot be negative';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
}
