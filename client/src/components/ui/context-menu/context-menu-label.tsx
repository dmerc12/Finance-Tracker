import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import * as React from 'react';
import { cn } from '../utils';

function ContextMenuLabel({
    className,
    inset,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & { inset?: boolean }) {
    return (
        <ContextMenuPrimitive.Label
            data-slot="context-menu-label"
            data-inset={inset}
            className={cn(
                'text-foreground px-2 py-1.5 text-sm font-medium data-inset:pl-8',
                className
            )}
            {...props}
        />
    );
}

export default ContextMenuLabel;
