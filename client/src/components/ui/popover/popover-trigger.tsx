import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
    return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

export default PopoverTrigger;
