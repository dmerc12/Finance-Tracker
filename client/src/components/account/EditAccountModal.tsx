import AccountForm, { type AccountFormData } from './AccountForm';
import { useState, useEffect } from 'react';
import validate from './accountValidation';
import type { Account } from '../../data';
import { FormDialog } from '../common';

interface EditAccountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: Account | null;
    onConfirm: (data: AccountFormData) => void;
}

export default function EditAccountModal({
    open,
    onOpenChange,
    account,
    onConfirm,
}: EditAccountModalProps) {
    const [formData, setFormData] = useState<AccountFormData>({
        name: '',
        type: 'Checking',
        balance: 0,
        institution: '',
        accountNumber: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (open && account) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                name: account.name,
                type: account.type as AccountFormData['type'],
                balance: account.balance,
                institution: account.institution || '',
                accountNumber: account.accountNumber || '',
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
