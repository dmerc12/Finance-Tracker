import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
    return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

export default SelectValue;
