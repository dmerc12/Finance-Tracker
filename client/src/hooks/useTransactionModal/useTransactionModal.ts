import type { TransactionFormData } from '../../components/transactions';
import { useState } from 'react';

interface UseTransactionModalOptions {
    initialData?: Partial<TransactionFormData>;
    onSubmit: (formData: TransactionFormData) => void;
    onClose: () => void;
}

export default function useTransactionModal({
    initialData,
    onSubmit,
    onClose,
}: UseTransactionModalOptions) {
    const [formData, setFormData] = useState<TransactionFormData>({
        description: initialData?.description ?? '',
        amount: initialData?.amount ?? 0,
        type: initialData?.type ?? 'expense',
        category: initialData?.category ?? '',
        accountId: initialData?.accountId ?? -1,
        date: initialData?.date ?? new Date().toISOString().split('T')[0],
        notes: initialData?.notes ?? '',
        toAccountId: initialData?.toAccountId ?? -1,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateFormData = (formData: TransactionFormData): Record<string, string> => {
        const errors: Record<string, string> = {};
        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }
        if (!formData.amount) {
            errors.amount = 'Amount is required';
        } else if (Number.isNaN(formData.amount)) {
            errors.amount = 'Amount must be a valid number';
        } else if (formData.amount <= 0) {
            errors.amount = 'Amount must be greater than 0';
        }
        if (formData.accountId === -1) {
            errors.accountId = 'Please select an account';
        }
        if (!formData.category) {
            errors.category = 'Please select a category';
        }
        if (formData.type === 'transfer' && formData.toAccountId === -1) {
            errors.toAccountId = 'Please select destination account';
        }
        if (formData.type === 'transfer' && formData.accountId === formData.toAccountId) {
            errors.toAccountId = 'Cannot transfer to the same account';
        }
        if (!formData.date) {
            errors.date = 'Date is required';
        }
        return errors;
    };

    const handleSubmit = () => {
        const newErrors = validateFormData(formData);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            onSubmit(formData);
        }
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    return { formData, setFormData, errors, handleSubmit, handleClose };
}
