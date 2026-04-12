import TransactionIcon from './TransactionIcon';
import type { Transaction } from '../../data';
import AmountDisplay from './AmountDisplay';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
    Badge,
    cn,
} from '../ui';

interface TransactionDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: Transaction | null;
    onEdit: (transaction: Transaction) => void;
    onDelete: (transaction: Transaction) => void;
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function TransactionDetailsModal({
    open,
    onOpenChange,
    transaction,
    onEdit,
    onDelete,
}: TransactionDetailsModalProps) {
    if (!transaction) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transaction Details</DialogTitle>
                    <DialogDescription>
                        View the complete information for this transaction.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className={cn(
                                'p-3 rounded-full',
                                transaction.type === 'income'
                                    ? 'bg-green-100'
                                    : transaction.type === 'expense'
                                      ? 'bg-red-100'
                                      : 'bg-blue-100'
                            )}
                        >
                            <TransactionIcon type={transaction.type} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold mb-0">
                                {transaction.description}
                            </h4>
                            <p className="text-sm text-slate-600 mb-0">
                                {formatDate(transaction.date)}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-xl">
                                <AmountDisplay
                                    amount={transaction.amount}
                                    type={transaction.type}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="text-sm text-slate-600 mb-1">Type</div>
                            <div className="font-medium capitalize">{transaction.type}</div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-600 mb-1">Category</div>
                            <div>
                                <Badge variant="secondary">{transaction.category}</Badge>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="text-sm text-slate-600 mb-1">Account</div>
                            <div className="font-medium">{transaction.accountName}</div>
                        </div>
                        {transaction.type === 'transfer' && transaction.toAccountName && (
                            <div className="col-span-2">
                                <div className="text-sm text-slate-600 mb-1">To Account</div>
                                <div className="font-medium">{transaction.toAccountName}</div>
                            </div>
                        )}
                        {transaction.notes && (
                            <div className="col-span-2">
                                <div className="text-sm text-slate-600 mb-1">Notes</div>
                                <div className="text-slate-600">{transaction.notes}</div>
                            </div>
                        )}
                        <div className="col-span-2">
                            <div className="text-sm text-slate-600 mb-1">Transaction ID</div>
                            <div className="font-mono text-sm">#{transaction.id}</div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            onOpenChange(false);
                            onEdit(transaction);
                        }}
                        variant="outline"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => {
                            onOpenChange(false);
                            onDelete(transaction);
                        }}
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                        Delete
                    </Button>
                    <Button onClick={() => onOpenChange(false)} variant="secondary">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
