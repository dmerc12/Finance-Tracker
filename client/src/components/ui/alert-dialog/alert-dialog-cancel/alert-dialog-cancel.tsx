import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { buttonVariants } from '../../button';
import * as React from 'react';
import { cn } from '../../utils';

function AlertDialogCancel({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
    return (
        <AlertDialogPrimitive.Cancel
            className={cn(buttonVariants({ variant: 'outline' }), className)}
            {...props}
        />
    );
}

export default AlertDialogCancel;
