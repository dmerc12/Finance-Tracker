import * as ResizablePrimitive from 'react-resizable-panels';
import * as React from 'react';

function ResizablePanel({ ...props }: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
    return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

export default ResizablePanel;
