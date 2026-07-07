import { Drawer as DrawerPrimitive } from 'vaul';
import * as React from 'react';

function Drawer({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) {
    return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

export default Drawer;
