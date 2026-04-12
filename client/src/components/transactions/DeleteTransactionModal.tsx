import AmountDisplay from './AmountDisplay';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
    Card,
    CardContent,
} from '../ui';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    type: 'income' | 'expense' | 'transfer';
    category: string;
    accountId: number;
    accountName: string;
    date: string;
    notes?: string;
    toAccountId?: number;
    toAccountName?: string;
}

interface DeleteTransactionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: Transaction | null;
    onConfirm: () => void;
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function DeleteTransactionModal({
    open,
    onOpenChange,
    transaction,
    onConfirm,
}: DeleteTransactionModalProps) {
    if (!transaction) return null;

    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Transaction</DialogTitle>
                    <DialogDescription>
                        Confirm permanent deletion of this transaction.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p>Are you sure you want to delete this transaction?</p>
                    <Card className="bg-slate-50">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-medium">{transaction.description}</div>
                                    <div className="text-sm text-slate-600">
                                        {formatDate(transaction.date)} • {transaction.category}
                                    </div>
                                </div>
                                <div>
                                    <AmountDisplay
                                        amount={transaction.amount}
                                        type={transaction.type}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <p className="text-red-600 mt-3 mb-0">
                        <strong>Warning:</strong> This action cannot be undone.
                    </p>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} variant="destructive">
                        Delete Transaction
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
