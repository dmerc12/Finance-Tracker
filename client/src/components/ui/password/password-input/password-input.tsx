import { useState, type ChangeEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../../button';
import { Label } from '../../label';
import { Input } from '../../input';

interface PasswordInputProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    autoComplete?: string;
}

function PasswordInput({
    id,
    name,
    label,
    value,
    onChange,
    error,
    autoComplete = 'new-password',
}: PasswordInputProps) {
    const [show, setShow] = useState(false);
    const errorId = `${id}-error`;

    return (
        <div className="mb-4">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative mt-1.5">
                <Input
                    type={show ? 'text' : 'password'}
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    className={`pr-10 ${error ? 'border-red-500' : ''}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-0 top-0 h-full px-3"
                    aria-label={show ? 'Hide Password' : 'Show Password'}
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
            </div>
            {error && (
                <p id={errorId} className="text-xs text-red-500 mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}

export default PasswordInput;
