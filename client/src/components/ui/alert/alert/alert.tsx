import { type VariantProps } from 'class-variance-authority';
import alertVariants from '../alertVariants/alertVariants.ts';
import { cn } from '../../utils';
import * as React from 'react';

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
