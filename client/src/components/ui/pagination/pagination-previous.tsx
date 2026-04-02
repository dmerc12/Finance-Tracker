import { ChevronLeftIcon } from 'lucide-react';
import PaginationLink from './pagination-link';
import * as React from 'react';
import { cn } from '../utils';

function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label="Go to previous page"
            size="default"
            className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
            {...props}
        >
            <ChevronLeftIcon />
            <span className="hidden sm:block">Previous</span>
        </PaginationLink>
    );
}

export default PaginationPrevious;
