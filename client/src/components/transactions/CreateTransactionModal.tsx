import TransactionForm, { type TransactionFormData } from './TransactionForm';
import { useTransactionModal } from '../../hooks';
import type { Account } from '../../types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
} from '../ui';

interface CreateTransactionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (formData: TransactionFormData) => void;
    accounts: Account[];
    defaultAccountId?: number;
}

export default function CreateTransactionModal({
    open,
    onOpenChange,
    onConfirm,
    accounts,
    defaultAccountId,
}: CreateTransactionModalProps) {
    const { formData, setFormData, errors, handleSubmit, handleClose } = useTransactionModal({
        initialData: defaultAccountId ? { accountId: defaultAccountId } : undefined,
        onSubmit: (data) => {
            onConfirm(data);
            onOpenChange(false);
        },
        onClose: () => onOpenChange(false),
    });

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent key={String(open)} className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Transaction</DialogTitle>
                    <DialogDescription>
                        Add a new transaction to track your income, expenses, or transfers.
                    </DialogDescription>
                </DialogHeader>
                <TransactionForm
                    formData={formData}
                    onChange={setFormData}
                    errors={errors}
                    accounts={accounts}
                    disableAccount={!!defaultAccountId}
                />
                <DialogFooter>
                    <Button onClick={handleClose} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Create Transaction</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
