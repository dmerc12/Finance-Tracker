import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import navigationMenuTriggerStyle from './navigation-menu-trigger-style';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '../utils';

function NavigationMenuTrigger({
    className,
    children,
    ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
    return (
        <NavigationMenuPrimitive.Trigger
            data-slot="navigation-menu-trigger"
            className={cn(navigationMenuTriggerStyle(), 'group', className)}
            {...props}
        >
            {children}{' '}
            <ChevronDownIcon
                className="relative top-px ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
                aria-hidden="true"
            />
        </NavigationMenuPrimitive.Trigger>
    );
}

export default NavigationMenuTrigger;
