import { Archive } from 'lucide-react';
import { ConfirmDialog } from '../common';

interface ArchiveAccountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accountId: number;
    accountName: string;
    onConfirm: (id: number) => void;
}

export default function ArchiveAccountModal({
    open,
    onOpenChange,
    accountId,
    accountName,
    onConfirm,
}: ArchiveAccountModalProps) {
    const handleConfirm = () => {
        onConfirm(accountId);
        onOpenChange(false);
    };

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Archive Account"
            description="Hide this account from your active accounts list while preserving transaction history."
            icon={<Archive size={32} />}
            iconBgColor="bg-yellow-500/10"
            iconColor="text-yellow-600"
            confirmLabel="Archive Account"
            confirmClassName="bg-yellow-500 hover:bg-yellow-600 text-white"
            onConfirm={handleConfirm}
        >
            <h5 className="text-lg font-semibold mb-3">Archive This Account?</h5>
            <p className="text-muted-foreground mb-2">
                You are about to archive <strong>{accountName}</strong>.
            </p>
            <p className="text-muted-foreground mb-0">
                <strong>Note:</strong> Archiving will hide this account from your active accounts
                list, but all transaction history will be preserved. You can restore it anytime.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3 text-left">
                <small className="text-blue-800">
                    <strong>Tip:</strong> Archived accounts can be viewed by toggling "Show //
                    Archived Accounts" and can be restored at any time.
                </small>
            </div>
        </ConfirmDialog>
    );
}
