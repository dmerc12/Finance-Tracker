import PasswordStrengthIndicator from '../password-strength-indicator';
import { Alert, AlertTitle, AlertDescription } from '../../alert';
import { checkPasswordRequirements } from '../../../../utils';
import { Check, X, Info } from 'lucide-react';
import { cn } from '../../utils';
import { useMemo } from 'react';

interface PasswordFeedbackProps {
    /** Current password value. When empty, nothing renders. */
    password: string;
    /** Score 0-6 from getPasswordStrength. Drives the bar. */
    strength: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    className?: string;
}

/**
 * Composite password feedback: strength bar + live requirements' checklist.
 * Both derive from the same password + personal-info inputs, so they're
 * rendered together to keep the two views in sync.
 */
export default function PasswordFeedback({
    password,
    strength,
    firstName,
    lastName,
    email,
    className,
}: PasswordFeedbackProps) {
    const requirements = useMemo(
        () => checkPasswordRequirements(password, firstName, lastName, email),
        [password, firstName, lastName, email]
    );

    if (!password) return null;

    return (
        <Alert variant="info" role="status" className={className}>
            <Info className="size-4" />
            <AlertTitle>Password Requirements</AlertTitle>
            <AlertDescription>
                <PasswordStrengthIndicator strength={strength} />
                <ul className="grid gap-1 text-xs" aria-label="Password requirements">
                    {requirements.map((req) => (
                        <li
                            key={req.id}
                            className={cn(
                                'flex items-center gap-1.5 transition-colors',
                                req.met ? 'text-green-600' : 'text-muted-foreground font-semibold'
                            )}
                        >
                            {req.met ? (
                                <Check className="size-3.5 shrink-0" aria-hidden="true" />
                            ) : (
                                <X className="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
                            )}
                            <span>{req.label}</span>
                            <span className="sr-only">{req.met ? 'met' : 'not met'}</span>
                        </li>
                    ))}
                </ul>
            </AlertDescription>
        </Alert>
    );
}
