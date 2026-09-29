import { cn } from '../../utils';
import * as React from 'react';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card"
            className={cn(
                'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border',
                className
            )}
            {...props}
        />
    );
}

export default Card;
