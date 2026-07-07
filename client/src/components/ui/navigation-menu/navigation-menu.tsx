import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import NavigationMenuViewport from './navigation-menu-viewport';
import * as React from 'react';
import { cn } from '../utils';

function NavigationMenu({
    className,
    children,
    viewport = true,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
    viewport?: boolean;
}) {
    return (
        <NavigationMenuPrimitive.Root
            data-slot="navigation-menu"
            data-viewport={viewport}
            className={cn(
                'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
                className
            )}
            {...props}
        >
            {children}
            {viewport && <NavigationMenuViewport />}
        </NavigationMenuPrimitive.Root>
    );
}

export default NavigationMenu;
