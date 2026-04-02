import * as MenubarPrimitive from '@radix-ui/react-menubar';
import * as React from 'react';

function MenubarGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Group>) {
    return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

export default MenubarGroup;
