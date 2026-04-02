import * as MenubarPrimitive from '@radix-ui/react-menubar';
import * as React from 'react';

function MenubarPortal({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
    return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

export default MenubarPortal;
