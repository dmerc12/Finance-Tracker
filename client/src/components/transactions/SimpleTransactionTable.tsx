import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DataTable, type ColumnDef } from '../common';
import { Badge } from '../ui/badge';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
}

interface SimpleTransactionTableProps {
    transactions: Transaction[];
    animationDelay?: number;
}

export default function SimpleTransactionTable({
    transactions,
    animationDelay = 0.8,
}: SimpleTransactionTableProps) {
    const columns: ColumnDef<Transaction>[] = [
        {
            key: 'date',
            header: 'Date',
            render: (transaction) => (
                <small className="text-muted-foreground">{transaction.date}</small>
            ),
        },
        {
            key: 'description',
            header: 'Description',
            render: (transaction) => (
                <div className="flex items-center gap-2">
                    <div
                        className={`${
                            transaction.type === 'income'
                                ? 'bg-green-500/10 text-green-600'
                                : 'bg-red-500/10 text-red-600'
                        } rounded-full flex items-center justify-center w-8 h-8 shrink-0`}
                    >
                        {transaction.type === 'income' ? (
                            <ArrowUpRight size={16} />
                        ) : (
                            <ArrowDownRight size={16} />
                        )}
                    </div>
                    <span>{transaction.description}</span>
                </div>
            ),
        },
        {
            key: 'category',
            header: 'Category',
            render: (transaction) => <Badge variant="secondary">{transaction.category}</Badge>,
        },
        {
            key: 'amount',
            header: 'Amount',
            headerClassName: 'text-right',
            className: 'text-right',
            render: (transaction) => (
                <strong
                    className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
                >
                    {transaction.type === 'income' ? '+' : ''}$
                    {Math.abs(transaction.amount).toFixed(2)}
                </strong>
            ),
        },
    ];

    return (
        <DataTable
            data={transactions}
            columns={columns}
            keyExtractor={(transaction) => transaction.id}
            animated
            animationDelay={animationDelay}
            getRowClassName={() => 'transition-colors hover:bg-muted/50'}
        />
    );
}
