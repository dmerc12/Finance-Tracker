import { useState, useEffect } from 'react';
import validate from './accountValidation';
import type { Account } from '../../types';
import AccountForm from './AccountForm';
import { FormDialog } from '../common';

interface EditAccountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: Account | null;
    onConfirm: (data: Account) => void;
}

export default function EditAccountModal({
    open,
    onOpenChange,
    account,
    onConfirm,
}: EditAccountModalProps) {
    const [formData, setFormData] = useState<Account>({
        id: -1,
        name: '',
        type: 'Checking',
        balance: 0,
        institution: '',
        accountNumber: '',
        lastUpdated: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (open && account) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                id: account.id,
                name: account.name,
                type: account.type as Account['type'],
                balance: account.balance,
                institution: account.institution || '',
                accountNumber: account.accountNumber || '',
                lastUpdated: account.lastUpdated || '',
            });
            setErrors({});
        }
    }, [open, account]);

    const handleSubmit = () => {
        const { isValid, errors } = validate(formData);
        if (!isValid) {
            setErrors(errors);
        } else {
            onConfirm(formData);
            onOpenChange(false);
            setErrors({});
        }
    };

    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Account"
            description="Update the account information below."
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
        >
            <AccountForm initialData={formData} onChange={setFormData} errors={errors} />
        </FormDialog>
    );
}
