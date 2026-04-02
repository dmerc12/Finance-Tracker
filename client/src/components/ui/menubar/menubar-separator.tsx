import * as MenubarPrimitive from '@radix-ui/react-menubar';
import * as React from 'react';
import { cn } from '../utils';

function MenubarSeparator({
    className,
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
    return (
        <MenubarPrimitive.Separator
            data-slot="menubar-separator"
            className={cn('bg-border -mx-1 my-1 h-px', className)}
            {...props}
        />
    );
}

export default MenubarSeparator;
