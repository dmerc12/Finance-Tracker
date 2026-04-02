import { Drawer as DrawerPrimitive } from 'vaul';
import * as React from 'react';

function DrawerTrigger({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
    return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

export default DrawerTrigger;
