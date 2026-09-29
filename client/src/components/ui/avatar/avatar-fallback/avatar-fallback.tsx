import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '../../utils';
import * as React from 'react';

function AvatarFallback({
    className,
    ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
    return (
        <AvatarPrimitive.Fallback
            data-slot="avatar-fallback"
            className={cn(
                'bg-muted flex size-full items-center justify-center rounded-full',
                className
            )}
            {...props}
        />
    );
}

export default AvatarFallback;
