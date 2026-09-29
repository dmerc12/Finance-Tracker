import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as React from 'react';

function AlertDialogTrigger({
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
    return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

export default AlertDialogTrigger;
