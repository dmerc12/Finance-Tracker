import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import * as React from 'react';

function ContextMenuTrigger({
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
    return <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />;
}

export default ContextMenuTrigger;
