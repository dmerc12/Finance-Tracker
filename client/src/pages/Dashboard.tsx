import { mockRecentTransactions, mockSpendingData, mockAccounts } from '../data';
import React from 'react';
import {
    DashboardLoadingState,
    DashboardEmptyState,
    SummaryCards,
    AccountSummarySection,
    SpendingChartCard,
    RecentTransactionsCard,
} from '../components/dashboard';

interface DashboardProps {
    isNewUser?: boolean;
    isLoading?: boolean;
}

const Dashboard: React.FC = ({ isNewUser = false, isLoading = false }: DashboardProps) => {
    if (isLoading) {
        return <DashboardLoadingState />;
    }

    if (isNewUser) {
        return <DashboardEmptyState />;
    }

    return (
        <>
            <SummaryCards
                totalBalance="$12,543.89"
                totalIncome="$8,240.00"
                totalExpenses="$4,890.23"
                savingsRate="40.6%"
                balanceTrend={{ value: '+12.5%', isPositive: true, label: 'from last month' }}
                incomeTrend={{ value: '+8.2%', isPositive: true, label: 'from last month' }}
                expensesTrend={{ value: '+3.1%', isPositive: false, label: 'from last month' }}
                savingsRateTrend={{ value: '+5.3%', isPositive: true, label: 'from last month' }}
            />
            <AccountSummarySection accounts={mockAccounts} animationDelay={0.5} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <SpendingChartCard data={mockSpendingData} animationDelay={0.5} />
                <RecentTransactionsCard
                    transactions={mockRecentTransactions}
                    animationDelay={0.6}
                />
            </div>
        </>
    );
};

export default Dashboard;
