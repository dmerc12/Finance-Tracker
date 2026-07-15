import * as MenubarPrimitive from '@radix-ui/react-menubar';
import * as React from 'react';

function MenubarSub({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
    return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

export default MenubarSub;
