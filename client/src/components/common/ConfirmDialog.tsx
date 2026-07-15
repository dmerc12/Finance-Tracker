import type { ReactNode } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
} from '../ui';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    icon?: ReactNode;
    iconBgColor?: string;
    iconColor?: string;
    children?: ReactNode;
    confirmLabel?: string;
    confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
    confirmClassName?: string;
    onConfirm?: () => void;
}

export default function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    icon,
    iconBgColor = 'bg-muted/10',
    iconColor = 'text-foreground',
    children,
    confirmLabel = 'Confirm',
    confirmVariant = 'default',
    confirmClassName,
    onConfirm,
}: ConfirmDialogProps) {
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="text-center py-3">
                    {icon && (
                        <div
                            className={`rounded-ful inline-flex items-center justify-center mb-3 w-16 h-16 ${iconBgColor} ${iconColor}`}
                        >
                            {icon}
                        </div>
                    )}
                    {children}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant={confirmVariant}
                        className={confirmClassName}
                        onClick={handleConfirm}
                    >
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
