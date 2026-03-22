import { ChevronLeft } from 'lucide-react';
import { buttonVariants } from '../button';
import * as React from 'react';
import { cn } from '../utils';

const PreviousButton = ({ className, ...props }: React.ComponentProps<'button'>) => (
    <button
        className={cn(
            buttonVariants({ variant: 'outline' }),
            'size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1',
            className
        )}
        {...props}
    >
        <ChevronLeft className="size-4" />
    </button>
);

export default PreviousButton;
