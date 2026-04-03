import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import TooltipProvider from './tooltip-provider';
import * as React from 'react';

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
    return (
        <TooltipProvider>
            <TooltipPrimitive.Root data-slot="tooltip" {...props} />
        </TooltipProvider>
    );
}

export default Tooltip;
