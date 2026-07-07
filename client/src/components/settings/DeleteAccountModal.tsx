import { AlertTriangle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Alert,
    AlertTitle,
    AlertDescription,
    Button,
} from '../ui';

interface DeleteProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export default function DeleteProfileModal({
    open,
    onOpenChange,
    onConfirm,
}: DeleteProfileModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-destructive">Delete Profile</DialogTitle>
                    <DialogDescription>
                        Are you absolutely sure you want to delete your profile? This action is
                        irreversible and will permanently delete all your data.
                    </DialogDescription>
                </DialogHeader>
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>
                        <strong>Warning:</strong>
                    </AlertTitle>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        This action is irreversible and will permanently delete your profile!
                    </AlertDescription>
                </Alert>
                <div className="mb-4">
                    <p className="text-sm mb-3">This will permanently delete:</p>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                        <li>Your profile and personal information</li>
                        <li>All accounts and their balances</li>
                        <li>All transaction history</li>
                        <li>All settings and preferences</li>
                    </ul>
                </div>
                <p className="text-sm text-destructive font-semibold mb-4">
                    This action cannot be undone. All your data will be lost forever.
                </p>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Yes, Delete My Profile
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
