import { Separator } from '../separator';
import * as React from 'react';
import { cn } from '../utils';

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
    return (
        <Separator
            data-slot="sidebar-separator"
            data-sidebar="separator"
            className={cn('bg-sidebar-border mx-2 w-auto', className)}
            {...props}
        />
    );
}

export default SidebarSeparator;
