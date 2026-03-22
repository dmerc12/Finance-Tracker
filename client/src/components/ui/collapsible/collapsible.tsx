import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import React from 'react';

function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
    return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

export default Collapsible;
