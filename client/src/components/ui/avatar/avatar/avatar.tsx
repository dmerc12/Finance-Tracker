import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '../../utils';
import * as React from 'react';

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
    return (
        <AvatarPrimitive.Root
            data-slot="avatar"
            className={cn('relative flex size-10 shrink-0 overflow-hidden rounded-full', className)}
            {...props}
        />
    );
}

export default Avatar;
