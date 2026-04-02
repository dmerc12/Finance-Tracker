import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import * as React from 'react';

function ContextMenu({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
    return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

export default ContextMenu;
