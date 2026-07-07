import { Wallet, CreditCard, TrendingUp, PiggyBank, type LucideIcon } from 'lucide-react';
import { Card, CardContent, Badge } from '../ui';
import { motion } from 'motion/react';
import { memo } from 'react';

interface AccountSummaryCardProps {
    accountName: string;
    accountType: 'Checking' | 'Savings' | 'Credit' | 'Investment';
    balance: number;
    institution?: string;
    accountNumber?: string;
    lastUpdated?: string;
    animationDelay?: number;
}

const accountIcons: Record<string, LucideIcon> = {
    Checking: Wallet,
    Savings: PiggyBank,
    Credit: CreditCard,
    Investment: TrendingUp,
};

const accountColors: Record<string, { bg: string; text: string }> = {
    Checking: { bg: 'bg-blue-100', text: 'text-blue-600' },
    Savings: { bg: 'bg-green-100', text: 'text-green-600' },
    Credit: { bg: 'bg-red-100', text: 'text-red-600' },
    Investment: { bg: 'bg-purple-100', text: 'text-purple-600' },
};

const AccountSummaryCard = memo(function AccountSummaryCard({
    accountName,
    accountType,
    balance,
    institution,
    accountNumber,
    lastUpdated,
    animationDelay = 0,
}: AccountSummaryCardProps) {
    const Icon = accountIcons[accountType];
    const colors = accountColors[accountType];
    const isNegative = balance < 0;
    const balanceColor = isNegative ? 'text-red-600' : 'text-green-600';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay, duration: 0.3 }}
        >
            <Card className="shadow-sm">
                <CardContent className="pt-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary">{accountType}</Badge>
                                {accountNumber && (
                                    <span className="text-sm text-slate-500">{accountNumber}</span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold mb-1">{accountName}</h3>
                            {institution && <p className="text-sm text-slate-600">{institution}</p>}
                        </div>
                        <div className={`${colors.bg} ${colors.text} rounded-full p-3`}>
                            <Icon size={24} />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-baseline justify-between">
                            <span className="text-sm text-slate-600">Current Balance</span>
                            {lastUpdated && (
                                <span className="text-xs text-slate-500">
                                    Updated {lastUpdated}
                                </span>
                            )}
                        </div>
                        <div className={`text-3xl font-bold mt-1 ${balanceColor}`}>
                            $
                            {Math.abs(balance).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
});

export default AccountSummaryCard;
