import useFormField from './useFormField';
import * as React from 'react';
import { cn } from '../utils';

function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message ?? '') : props.children;

    if (!body) {
        return null;
    }

    return (
        <p
            data-slot="form-message"
            id={formMessageId}
            className={cn('text-destructive text-sm', className)}
            {...props}
        >
            {body}
        </p>
    );
}

export default FormMessage;
