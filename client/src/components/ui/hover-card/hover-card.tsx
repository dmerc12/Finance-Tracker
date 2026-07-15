import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import * as React from 'react';

function HoverCard({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
    return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

export default HoverCard;
