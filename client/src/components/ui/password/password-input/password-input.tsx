import { useState, type ComponentProps } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../../button';
import { Input } from '../../input';
import { cn } from '../../utils';

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type'>;

function PasswordInput({ className, ...props }: PasswordInputProps) {
    const [show, setShow] = useState(false);

    return (
        <div className={cn('relative', className)}>
            <Input {...props} type={show ? 'text' : 'password'} className="pr-10" />
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
    );
}

export default PasswordInput;
