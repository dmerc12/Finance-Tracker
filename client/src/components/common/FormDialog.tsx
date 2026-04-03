import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
} from '../ui';

interface FormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    children: React.ReactNode;
    submitLabel?: string;
    cancelLabel?: string;
    onSubmit: () => void;
    isSubmitting?: boolean;
    submitDisabled?: boolean;
    submitVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
}

export default function FormDialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    submitLabel = 'Save',
    cancelLabel = 'Cancel',
    onSubmit,
    isSubmitting = false,
    submitDisabled = false,
    submitVariant = 'default',
}: FormDialogProps) {
    const handleClose = () => {
        if (!isSubmitting) onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    <div className="space-y-4 py-2">{children}</div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                            {cancelLabel}
                        </Button>
                        <Button variant={submitVariant} disabled={submitDisabled || isSubmitting}>
                            {isSubmitting ? 'Saving...' : submitLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
