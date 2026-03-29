import Command from './command';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../dialog';

function CommandDialog({
    title = 'Command Palette',
    description = 'Search for a command to run...',
    children,
    ...props
}: React.ComponentProps<typeof Dialog> & { title?: string; description: string }) {
    return (
        <Dialog {...props}>
            <DialogHeader className="sr-only">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogContent className="overflow-hidden p-0">
                <Command
                    className="**:[[cmdk-group-heading]]:text-muted-foreground
                **:data-[slot=command-input-wrapper]:h-12 **:[[cmdk-group-heading]]:px-2
                **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group]]:px-2
                [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5
                [&_[cmdk-input-wrapper]_svg]:w-5 **:[[cmdk-input]]:h-12 [&_cmdk-item]]:px-2 **:[[cmdk-item]]:py-3
                [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
                >
                    {children}
                </Command>
            </DialogContent>
        </Dialog>
    );
}

export default CommandDialog;
