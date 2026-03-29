import { Command as CommandPrimitive } from 'cmdk';
import { cn } from '../utils';
import React from 'react';

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
    return (
        <CommandPrimitive.List
            data-slot="command-list"
            className={cn('max-h-75 scroll-py-1 overflow-x-hidden overflow-y-auto', className)}
            {...props}
        />
    );
}

export default CommandList;
