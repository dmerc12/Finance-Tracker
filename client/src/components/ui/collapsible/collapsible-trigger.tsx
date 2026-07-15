import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import React from 'react';

function CollapsibleTrigger({
    ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
    return <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />;
}

export default CollapsibleTrigger;
