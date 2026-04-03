import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
    return <SelectPrimitive.Root data-slot="select" {...props} />;
}

export default Select;
