import { Drawer as DrawerPrimitive } from 'vaul';
import * as React from 'react';
import { cn } from '../utils';

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
    return (
        <DrawerPrimitive.Title
            data-slot="drawer-title"
            className={cn('text-foreground font-semibold', className)}
            {...props}
        />
    );
}

export default DrawerTitle;
