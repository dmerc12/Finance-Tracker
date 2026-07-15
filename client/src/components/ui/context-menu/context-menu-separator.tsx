import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import * as React from 'react';
import { cn } from '../utils';

function ContextMenuSeparator({
    className,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
    return (
        <ContextMenuPrimitive.Separator
            data-slot="context-menu-separator"
            className={cn('bg-border -mx-1 my-1 h-px', className)}
            {...props}
        />
    );
}

export default ContextMenuSeparator;
