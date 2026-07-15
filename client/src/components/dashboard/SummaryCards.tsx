import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, type LucideIcon } from 'lucide-react';
import { StatsGrid, StatCard } from '../common';
import { useMemo } from 'react';

interface SummaryCardsProps {
    totalBalance: string;
    totalIncome: string;
    totalExpenses: string;
    savingsRate: string;
    balanceTrend: { value: string; isPositive: boolean; label: string };
    incomeTrend: { value: string; isPositive: boolean; label: string };
    expensesTrend: { value: string; isPositive: boolean; label: string };
    savingsRateTrend: { value: string; isPositive: boolean; label: string };
}

type StatKey = 'balance' | 'income' | 'expenses' | 'savingsRate';

const statConfig: Record<
    StatKey,
    {
        label: string;
        icon: LucideIcon;
        iconColor: string;
        valueColor?: string;
    }
> = {
    balance: {
        label: 'Total Balance',
        icon: Wallet,
        iconColor: 'text-blue-600',
    },
    income: {
        label: 'Total Income',
        icon: ArrowUpRight,
        iconColor: 'text-green-600',
        valueColor: 'text-green-600',
    },
    expenses: {
        label: 'Total Expenses',
        icon: ArrowDownRight,
        iconColor: 'text-red-600',
        valueColor: 'text-red-600',
    },
    savingsRate: {
        label: 'Savings Rate',
        icon: TrendingUp,
        iconColor: 'text-cyan-600',
    },
};

export default function SummaryCards(props: SummaryCardsProps) {
    const stats = useMemo(
        () => [
            { key: 'balance' as StatKey, value: props.totalBalance, trend: props.balanceTrend },
            { key: 'income' as StatKey, value: props.totalIncome, trend: props.incomeTrend },
            { key: 'expenses' as StatKey, value: props.totalExpenses, trend: props.expensesTrend },
            {
                key: 'savingsRate' as StatKey,
                value: props.savingsRate,
                trend: props.savingsRateTrend,
            },
        ],
        [props]
    );

    return (
        <StatsGrid columns={4} className="mb-4">
            {stats.map(({ key, value, trend }, index) => {
                const config = statConfig[key];
                return (
                    <StatCard
                        key={key}
                        label={config.label}
                        value={value}
                        icon={config.icon}
                        iconColor={config.iconColor}
                        valueColor={config.valueColor}
                        trend={trend}
                        animationDelay={0.1 + index * 0.1}
                    />
                );
            })}
        </StatsGrid>
    );
}
