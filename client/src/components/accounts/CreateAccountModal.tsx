import AccountForm, { type AccountFormData } from './AccountForm';
import validate from './accountValidation';
import { FormDialog } from '../common';
import { useState } from 'react';

interface CreateAccountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (data: AccountFormData) => void;
}

export default function CreateAccountModal({
    open,
    onOpenChange,
    onConfirm,
}: CreateAccountModalProps) {
    const [formData, setFormData] = useState<AccountFormData>({
        name: '',
        type: 'Checking',
        balance: 0,
        institution: '',
        accountNumber: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = () => {
        const { isValid, errors } = validate(formData);
        if (isValid) {
            onConfirm(formData);
            handleClose();
        } else {
            setErrors(errors);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            type: 'Checking',
            balance: 0,
            institution: '',
            accountNumber: '',
        });
        setErrors({});
        onOpenChange(false);
    };

    return (
        <FormDialog
            open={open}
            onOpenChange={handleClose}
            title="Create New Account"
            description="Add a new financial account to track your balance and transactions."
            onSubmit={handleSubmit}
            submitLabel="Create Account"
        >
            <AccountForm initialData={formData} onChange={setFormData} errors={errors} />
        </FormDialog>
    );
}
