import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { buttonVariants } from '../button';
import * as React from 'react';
import { cn } from '../utils';

function AlertDialogAction({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
    return <AlertDialogPrimitive.Action className={cn(buttonVariants(), className)} {...props} />;
}

export default AlertDialogAction;
