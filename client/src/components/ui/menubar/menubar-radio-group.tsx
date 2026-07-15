import * as MenubarPrimitive from '@radix-ui/react-menubar';
import * as React from 'react';

function MenubarRadioGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
    return <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />;
}

export default MenubarRadioGroup;
