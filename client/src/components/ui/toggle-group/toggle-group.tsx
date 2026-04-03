import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { type VariantProps } from 'class-variance-authority';
import { toggleVariants } from '../toggle';
import * as React from 'react';
import { cn } from '../utils';

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
    size: 'default',
    variant: 'default',
});

function ToggleGroup({
    className,
    variant,
    size,
    children,
    ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>) {
    return (
        <ToggleGroupPrimitive.Root
            data-slot="toggle-group"
            data-variant={variant}
            data-size={size}
            className={cn(
                'group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs',
                className
            )}
            {...props}
        >
            <ToggleGroupContext.Provider value={{ variant, size }}>
                {children}
            </ToggleGroupContext.Provider>
        </ToggleGroupPrimitive.Root>
    );
}

export default ToggleGroup;
export { ToggleGroupContext };
