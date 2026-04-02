import * as MenubarPrimitive from '@radix-ui/react-menubar';
import * as React from 'react';

function MenubarMenu({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
    return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

export default MenubarMenu;
