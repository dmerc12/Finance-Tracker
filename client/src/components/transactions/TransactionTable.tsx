import { DataTable, type ColumnDef, type DataTableAction } from '../common';
import { Eye, Edit, Trash2, Receipt } from 'lucide-react';
import TransactionIcon from './TransactionIcon';
import type { Transaction } from '../../types';
import AmountDisplay from './AmountDisplay';
import { Badge } from '../ui';

interface TransactionTableProps {
    transactions: Transaction[];
    selectedTransactions: Set<number>;
    onToggleSelect: (id: number) => void;
    onToggleSelectAll: () => void;
    onViewDetails: (transaction: Transaction) => void;
    onEdit: (transaction: Transaction) => void;
    onDelete: (transaction: Transaction) => void;
    hasActiveFilters?: boolean;
    formatDate: (dateString: string) => string;
}

export default function TransactionTable({
    transactions,
    selectedTransactions,
    onToggleSelect,
    onToggleSelectAll,
    onViewDetails,
    onEdit,
    onDelete,
    hasActiveFilters = false,
    formatDate,
}: TransactionTableProps) {
    const columns: ColumnDef<Transaction>[] = [
        {
            key: 'icon',
            header: '',
            headerClassName: 'w-10',
            render: (transaction) => <TransactionIcon type={transaction.type} />,
        },
        {
            key: 'date',
            header: 'Date',
            render: (transaction) => (
                <span className="text-sm">{formatDate(transaction.date)}</span>
            ),
        },
        {
            key: 'description',
            header: 'Description',
            render: (transaction) => (
                <div>
                    <div className="font-medium">{transaction.description}</div>
                    {transaction.notes && (
                        <div className="text-sm text-slate-600">{transaction.notes}</div>
                    )}
                </div>
            ),
        },
        {
            key: 'category',
            header: 'Category',
            render: (transaction) => <Badge variant="secondary">{transaction.category}</Badge>,
        },
        {
            key: 'account',
            header: 'Account',
            className: 'text-sm',
            render: (transaction) => (
                <div>
                    {transaction.accountName}
                    {transaction.type === 'transfer' && transaction.toAccountName && (
                        <div className="text-slate-600">→ {transaction.toAccountName}</div>
                    )}
                </div>
            ),
        },
        {
            key: 'amount',
            header: 'Amount',
            headerClassName: 'text-right',
            className: 'text-right',
            render: (transaction) => (
                <AmountDisplay
                    amount={transaction.amount}
                    type={transaction.type}
                    className="font-medium"
                />
            ),
        },
    ];

    const actions: DataTableAction<Transaction>[] = [
        {
            label: 'View Details',
            icon: <Eye size={16} />,
            onClick: onViewDetails,
            variant: 'outline',
            title: 'View Details',
        },
        {
            label: 'Edit',
            icon: <Edit size={16} />,
            onClick: onEdit,
            variant: 'outline',
            title: 'Edit',
        },
        {
            label: 'Delete',
            icon: <Trash2 size={16} />,
            onClick: onDelete,
            variant: 'outline',
            className: 'border-red-300 text-red-700 hover:bg-red-50',
            title: 'Delete',
        },
    ];

    return (
        <DataTable
            data={transactions}
            columns={columns}
            keyExtractor={(transaction) => transaction.id}
            selectable
            selectedKeys={selectedTransactions}
            onToggleSelect={(key) => onToggleSelect(Number(key))}
            onToggleSelectAll={onToggleSelectAll}
            actions={actions}
            emptyStateMessage={
                hasActiveFilters ? 'No transactions match your filters' : 'No transactions yet'
            }
            emptyStateIcon={<Receipt size={48} className="text-slate-400" />}
        />
    );
}
