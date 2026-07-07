import { ArrowDownRight, ArrowUpRight, ArrowRightLeft } from 'lucide-react';

interface TransactionIconProps {
    type: 'income' | 'expense' | 'transfer';
    size?: number;
}

export default function TransactionIcon({ type, size = 20 }: TransactionIconProps) {
    switch (type) {
        case 'income':
            return <ArrowDownRight className="text-green-600" size={size} />;
        case 'expense':
            return <ArrowUpRight className="text-red-600" size={size} />;
        case 'transfer':
            return <ArrowRightLeft className="text-blue-600" size={size} />;
    }
}
