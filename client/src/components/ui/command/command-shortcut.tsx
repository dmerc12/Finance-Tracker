import { cn } from '../utils';
import React from 'react';

function CommandShortcut({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="command-shortcut"
            className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
            {...props}
        />
    );
}

export default CommandShortcut;
