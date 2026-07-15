import { Drawer as DrawerPrimitive } from 'vaul';
import * as React from 'react';

function DrawerClose({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) {
    return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

export default DrawerClose;
