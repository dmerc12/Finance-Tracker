import { type VariantProps } from 'class-variance-authority';
import alertVariants from './alertVariants.ts';
import * as React from 'react';
import { cn } from '../utils';

function Alert({
    className,
    variant,
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
    return (
        <div
            data-slot="alert"
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        />
    );
}

export default Alert;
