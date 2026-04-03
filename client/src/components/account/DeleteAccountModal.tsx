import { ConfirmDialog } from '../common';
import { Trash2 } from 'lucide-react';

interface DeleteAccountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accountId: number;
    accountName: string;
    onConfirm: (id: number) => void;
}

export default function DeleteAccountModal({
    open,
    onOpenChange,
    accountId,
    accountName,
    onConfirm,
}: DeleteAccountModalProps) {
    const handleConfirm = () => {
        onConfirm(accountId);
        onOpenChange(false);
    };

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete Account"
            description="Confirm permanent deletion of this account."
            icon={<Trash2 size={32} />}
            iconBgColor="bg-red-500/10"
            iconColor="text-red-600"
            confirmLabel="Delete Account"
            confirmVariant="destructive"
            onConfirm={handleConfirm}
        >
            <h5 className="text-lg font-semibold mb-3">Permanently Delete Account?</h5>
            <p className="text-muted-foreground mb-2">
                You are about to <strong>permanently delete</strong> <strong>{accountName}</strong>.
            </p>
            <p className="text-red-600 mb-0">
                <strong>Warning:</strong> This will delete ALL transactions and data associated with
                this account. This action cannot be undone.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3 text-left">
                <small className="text-yellow-800">
                    <strong>Tip:</strong> Consider archiving this account instead to preserve your
                    transaction history.
                </small>
            </div>
        </ConfirmDialog>
    );
}
