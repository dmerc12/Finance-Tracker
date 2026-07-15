import { Drawer as DrawerPrimitive } from 'vaul';
import * as React from 'react';

function DrawerPortal({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
    return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

export default DrawerPortal;
