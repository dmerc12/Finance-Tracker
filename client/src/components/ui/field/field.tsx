import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Label } from '../label';
import { cn } from '../utils';

interface FieldContextValue {
    id: string;
    error?: string;
    description?: string;
}

const FieldContext = createContext<FieldContextValue | null>(null);

function useFieldContext() {
    const ctx = useContext(FieldContext);
    if (!ctx) throw new Error('Field components must be used within <Field>');
    return ctx;
}

interface FieldProps {
    id: string;
    label: string;
    error?: string;
    description?: string;
    className?: string;
    children: ReactNode;
}

export default function Field({ id, label, error, description, className, children }: FieldProps) {
    return (
        <FieldContext.Provider value={{ id, error, description }}>
            <div className={cn('mb-4 mt-1.5', className)}>
                <Label
                    htmlFor={id}
                    data-error={!!error}
                    className="data-[error=true]:text-destructive"
                >
                    {label}
                </Label>
                <div className="mt-1.5">{children}</div>
                {description && !error && (
                    <p id={`${id}-description`} className="text-muted-foreground text-sm mt-1">
                        {description}
                    </p>
                )}
                {error && (
                    <p id={`${id}-error`} className="text-destructive text-sm mt-1">
                        {error}
                    </p>
                )}
            </div>
        </FieldContext.Provider>
    );
}

export function FieldControl({ ...props }: ComponentProps<typeof Slot>) {
    const { id, error, description } = useFieldContext();
    return (
        <Slot
            id={id}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
            {...props}
        />
    );
}
