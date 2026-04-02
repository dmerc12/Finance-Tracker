import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import * as React from 'react';

function ContextMenuSub({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
    return <ContextMenuPrimitive.Root data-slot="context-menu-sub" {...props} />;
}

export default ContextMenuSub;
