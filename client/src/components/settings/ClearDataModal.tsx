import { AlertTriangle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Alert,
    AlertDescription,
    Button,
} from '../ui';

interface ClearDataModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export default function ClearDataModal({ open, onOpenChange, onConfirm }: ClearDataModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Data Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to clear all data (accounts and transactions)? Your
                        settings and profile will remain intact.
                    </DialogDescription>
                </DialogHeader>
                <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>Warning: This action cannot be undone!</AlertDescription>
                </Alert>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Yes, Clear Data
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
