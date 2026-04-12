import TransactionForm, { type TransactionFormData } from './TransactionForm';
import type { Account, Transaction } from '../../data';
import { useTransactionModal } from '../../hooks';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
} from '../ui';

interface EditTransactionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: Transaction | null;
    onConfirm: (formData: TransactionFormData) => void;
    accounts: Account[];
}

export default function EditTransactionModal({
    open,
    onOpenChange,
    transaction,
    onConfirm,
    accounts,
}: EditTransactionModalProps) {
    const { formData, setFormData, errors, handleSubmit, handleClose } = useTransactionModal({
        initialData: transaction
            ? {
                  description: transaction.description,
                  amount: transaction.amount,
                  type: transaction.type,
                  category: transaction.category,
                  accountId: transaction.accountId,
                  date: transaction.date,
                  notes: transaction.notes ?? '',
                  toAccountId: transaction.toAccountId ?? -1,
              }
            : undefined,
        onSubmit: (data) => {
            onConfirm(data);
            onOpenChange(false);
        },
        onClose: () => onOpenChange(false),
    });

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent key={transaction?.id} className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
                    <DialogDescription>Update the transaction details below.</DialogDescription>
                </DialogHeader>
                <TransactionForm
                    formData={formData}
                    onChange={setFormData}
                    errors={errors}
                    accounts={accounts}
                />
                <DialogFooter>
                    <Button onClick={handleClose} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
