import { Command as CommandPrimitive } from 'cmdk';
import { cn } from '../utils';
import React from 'react';

function CommandSeparator({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
    return (
        <CommandPrimitive.Separator
            data-slot="command-separator"
            className={cn('bg-border -mx-1 h-px', className)}
            {...props}
        />
    );
}

export default CommandSeparator;
