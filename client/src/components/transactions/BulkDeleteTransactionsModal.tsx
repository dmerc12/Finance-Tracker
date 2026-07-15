import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '../ui/dialog';

interface BulkDeleteTransactionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCount: number;
    onConfirm: () => void;
}

export default function BulkDeleteTransactionModal({
    open,
    onOpenChange,
    selectedCount,
    onConfirm,
}: BulkDeleteTransactionModalProps) {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Selected Transactions</DialogTitle>
                    <DialogDescription>
                        Permanently delete multiple transactions at once.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p>
                        Are you sure you want to delete <strong>{selectedCount}</strong> selected
                        transaction{selectedCount !== 1 ? 's' : ''}?
                    </p>
                    <p className="text-red-600 mb-0">
                        <strong>Warning:</strong> This action cannot be undone.
                    </p>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} variant="destructive">
                        Delete {selectedCount} Transaction
                        {selectedCount !== 1 ? 's' : ''}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
