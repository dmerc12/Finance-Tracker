interface AmountDisplayProps {
    amount: number;
    type: 'income' | 'expense' | 'transfer';
    className?: string;
}

export default function AmountDisplay({ amount, type, className = '' }: AmountDisplayProps) {
    const formatted = `$${amount.toFixed(2)}`;
    let displayAmount: string;

    if (type === 'income') {
        displayAmount = `+${formatted}`;
    } else if (type === 'expense') {
        displayAmount = `-${formatted}`;
    } else {
        displayAmount = formatted;
    }

    let colorClass: string;
    if (type === 'income') {
        colorClass = 'text-green-600';
    } else if (type === 'expense') {
        colorClass = 'text-red-600';
    } else {
        colorClass = 'text-blue-600';
    }

    return <strong className={`${colorClass} ${className}`}>{displayAmount}</strong>;
}
