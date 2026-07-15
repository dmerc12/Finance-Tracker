import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import * as React from 'react';

function ContextMenuPortal({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
    return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />;
}

export default ContextMenuPortal;
