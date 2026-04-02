import * as ResizablePrimitive from 'react-resizable-panels';
import * as React from 'react';
import { cn } from '../utils';

function ResizablePanelGroup({
    className,
    ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
    return (
        <ResizablePrimitive.PanelGroup
            data-slot="resizable-panel-group"
            className={cn(
                'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
                className
            )}
            {...props}
        />
    );
}

export default ResizablePanelGroup;
