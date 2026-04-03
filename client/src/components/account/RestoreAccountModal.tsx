import { ArchiveRestore } from 'lucide-react';
import { ConfirmDialog } from '../common';

interface RestoreAccountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accountId: number;
    accountName: string;
    onConfirm: (id: number) => void;
}

export default function RestoreAccountModal({
    open,
    onOpenChange,
    accountId,
    accountName,
    onConfirm,
}: RestoreAccountModalProps) {
    const handleConfirm = () => {
        onConfirm(accountId);
        onOpenChange(false);
    };

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Restore Account"
            description="Make this archived account visible and active again."
            icon={<ArchiveRestore size={32} />}
            iconBgColor="bg-green-500/10"
            iconColor="text-green-600"
            confirmLabel="Restore Account"
            confirmClassName="bg-green-500 hover:bg-green-600"
            onConfirm={handleConfirm}
        >
            <h5 className="text-lg font-semibold mb-3">Restore This Account?</h5>
            <p className="text-muted-foreground mb-2">
                You are about to restore <strong>{accountName}</strong>.
            </p>
            <p className="text-muted-foreground mb-0">
                <strong>Note:</strong> Restoring will make this account visible in your active
                accounts list.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3 text-left">
                <small className="text-blue-800">
                    <strong>Tip:</strong> Restored accounts can be viewed and managed like any other
                    active account.
                </small>
            </div>
        </ConfirmDialog>
    );
}
