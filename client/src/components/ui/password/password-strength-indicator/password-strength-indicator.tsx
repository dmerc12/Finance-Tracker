const STRENGTH_LABELS = ['', 'Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
const STRENGTH_COLORS = [
    '',
    'bg-red-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-green-600',
];

interface PasswordStrengthIndicatorProps {
    strength: number;
}

function PasswordStrengthIndicator({ strength }: PasswordStrengthIndicatorProps) {
    if (strength <= 0) return null;

    const label = STRENGTH_LABELS[strength] ?? '';
    const color = STRENGTH_COLORS[strength] ?? '';
    const percent = (strength / 6) * 100;

    return (
        <div className="mt-2" aria-live="polite">
            <div className="flex justify-between text-xs mb-1">
                <span>Password strength:</span>
                <span className="font-medium">{label}</span>
            </div>
            <div
                className="h-2 w-full bg-gray-200 rounded"
                role="progressbar"
                aria-valuenow={strength}
                aria-valuemin={0}
                aria-valuemax={6}
                aria-label={`Password strength: ${label}`}
            >
                <div
                    style={{ width: `${percent}%` }}
                    className={`h-2 rounded transition-all duration-300 ${color}`}
                />
            </div>
        </div>
    );
}

export default PasswordStrengthIndicator;
