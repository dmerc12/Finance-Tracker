import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

export default DialogTrigger;
