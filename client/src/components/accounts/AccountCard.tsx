import { Card, CardContent, Badge, Button, Checkbox } from '../ui';
import type { Account } from '../../data';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    Wallet,
    CreditCard,
    TrendingUp,
    PiggyBank,
    Edit,
    Trash2,
    Eye,
    Archive,
    ArchiveRestore,
    Receipt,
} from 'lucide-react';

interface AccountCardProps {
    account: Account;
    index: number;
    isSelected: boolean;
    onSelect: (id: number) => void;
    onEdit: (account: Account) => void;
    onDelete: (account: Account) => void;
    onArchive?: (account: Account) => void;
    onRestore?: (account: Account) => void;
}

const getAccountIcon = (type: Account['type']) => {
    switch (type) {
        case 'Checking':
            return <Wallet size={20} />;
        case 'Savings':
            return <PiggyBank size={20} />;
        case 'Credit':
            return <CreditCard size={20} />;
        case 'Investment':
            return <TrendingUp size={20} />;
    }
};

const getAccountColor = (type: Account['type']) => {
    switch (type) {
        case 'Checking':
            return 'bg-blue-500/10 text-blue-600';
        case 'Savings':
            return 'bg-green-500/10 text-green-600';
        case 'Credit':
            return 'bg-yellow-500/10 text-yellow-600';
        case 'Investment':
            return 'bg-cyan-500/10 text-cyan-600';
    }
};

const getAccountBadgeColor = (type: Account['type']) => {
    switch (type) {
        case 'Checking':
            return 'bg-blue-500 hover:bg-blue-600';
        case 'Savings':
            return 'bg-green-500 hover:bg-green-600';
        case 'Credit':
            return 'bg-yellow-500 hover:bg-yellow-600';
        case 'Investment':
            return 'bg-cyan-500 hover:bg-cyan-600';
    }
};

export default function AccountCard({
    account,
    index,
    isSelected,
    onSelect,
    onEdit,
    onDelete,
    onArchive,
    onRestore,
}: AccountCardProps) {
    const isZeroBalance = Math.abs(account.balance) <= 0.001;

    return (
        <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className="hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="pt-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => onSelect(account.id)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div
                                className={`${getAccountColor(account.type)} rounded-full flex items-center justify-center w-10 h-10`}
                            >
                                {getAccountIcon(account.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Link
                                        to={`/accounts/${account.id}`}
                                        className="text-lg font-semibold hover:underline"
                                    >
                                        {account.name}
                                    </Link>
                                    {account.archived && (
                                        <Badge variant="secondary">Archived</Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge className={getAccountBadgeColor(account.type)}>
                                        {account.type}
                                    </Badge>
                                </div>
                                <small className="text-muted-foreground block">
                                    {account.institution} • {account.accountNumber}
                                </small>
                            </div>
                        </div>
                        <div className="text-right">
                            <div
                                className={`text-2xl font-bold mb-1 ${
                                    account.balance >= 0 ? 'text-gray-900' : 'text-yellow-600'
                                }`}
                            >
                                ${Math.abs(account.balance).toFixed(2)}
                            </div>
                            <small className="text-muted-foreground">
                                Updated {account.lastUpdated}
                            </small>
                        </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm" asChild>
                            <Link to={`/accounts/${account.id}`}>
                                <Eye size={16} />
                                View
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link to={`/transactions?accountId=${account.id}`}>
                                <Receipt size={16} />
                                Transactions
                            </Link>
                        </Button>

                        {!account.archived ? (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onEdit(account);
                                    }}
                                >
                                    <Edit size={16} />
                                    Edit
                                </Button>
                                {isZeroBalance && onArchive && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onArchive(account);
                                        }}
                                        className="text-yellow-600 hover:text-yellow-700"
                                    >
                                        <Archive size={16} />
                                        Archive
                                    </Button>
                                )}
                            </>
                        ) : (
                            <>
                                {onRestore && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onRestore(account);
                                        }}
                                        className="text-green-600 hover:text-green-700"
                                    >
                                        <ArchiveRestore size={16} />
                                        Restore
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onDelete(account);
                                    }}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
