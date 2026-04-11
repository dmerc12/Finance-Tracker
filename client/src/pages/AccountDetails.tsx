import { ArrowLeft, Receipt, Edit, Archive, Trash2, ArchiveRestore } from 'lucide-react';
import { mockBalanceHistory, mockMonthlyActivity, type Account } from '../data';
import { Link, useParams, useOutletContext } from 'react-router-dom';
import { Button, Badge, Card, CardContent } from '../components/ui';
import { SimpleTransactionTable } from '../components/transactions';
import { useManageAccounts, useAccountDetails } from '../hooks';
import { useEffect, type ReactNode } from 'react';
import {
    EditAccountModal,
    DeleteAccountModal,
    ArchiveAccountModal,
    RestoreAccountModal,
    type AccountFormData,
} from '../components/accounts';
import {
    AccountSummaryCard,
    StatsGrid,
    StatCard,
    LineChartCard,
    BarChartCard,
    EmptyState,
} from '../components/common';

export default function AccountDetails() {
    const { id } = useParams();
    const accountId = Number(id);
    const { accounts, updateAccount, deleteAccount } = useManageAccounts();
    const account = accounts.find((account) => account.id === accountId);

    const {
        showEditModal,
        showDeleteModal,
        showArchiveModal,
        showRestoreModal,
        setShowEditModal,
        setShowDeleteModal,
        setShowArchiveModal,
        setShowRestoreModal,
        transactionsToShow,
        displayedTransactions,
        setTransactionsToShow,
        totalIncome,
        totalExpenses,
        transactionCount,
        handleEditAccount,
        handleDeleteAccount,
        handleArchiveAccount,
        handleRestoreAccount,
    } = useAccountDetails({
        account: account,
        transactions: [],
        onAccountUpdate: (updatedAccount) => updateAccount(accountId, updatedAccount),
        onAccountDelete: () => deleteAccount(accountId),
    });

    const { setHeaderActions } = useOutletContext<{
        setHeaderActions: (actions: ReactNode) => void;
    }>();

    useEffect(() => {
        if (!account) return;
        // Build action buttons for header
        const actions = (
            <>
                <Button onClick={() => setShowEditModal(true)}>
                    <Edit size={16} className="mr-2" />
                    Edit
                </Button>
                {account.archived ? (
                    <Button onClick={() => setShowRestoreModal(true)}>
                        <ArchiveRestore size={16} className="mr-2" />
                        Restore
                    </Button>
                ) : (
                    Math.abs(account.balance) <= 0.001 && (
                        <Button onClick={() => setShowArchiveModal(true)}>
                            <Archive size={16} className="mr-2" />
                            Archive
                        </Button>
                    )
                )}
                {account.archived && (
                    <Button
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                    </Button>
                )}
            </>
        );
        setHeaderActions(actions);
        return () => setHeaderActions(null);
    }, [
        account,
        setHeaderActions,
        setShowEditModal,
        setShowRestoreModal,
        setShowArchiveModal,
        setShowDeleteModal,
    ]);

    if (!account) {
        return (
            <EmptyState
                icon={Archive}
                title="Account not found"
                description="The account you're looking for doesn't exist or has been removed."
                actions={[
                    {
                        label: 'Back to Accounts',
                        onClick: () => (window.location.href = '/accounts'),
                    },
                ]}
            />
        );
    }

    const handleEditAccountWrapper = (formData: AccountFormData) => {
        const updatedAccount: Account = {
            ...account,
            name: formData.name,
            type: formData.type,
            balance: formData.balance,
            institution: formData.institution,
            accountNumber: formData.accountNumber,
            lastUpdated: new Date().toISOString().split('T')[0],
        };
        handleEditAccount(updatedAccount);
    };

    return (
        <div className="space-y-4">
            {/* Back Button */}
            <div>
                <Button variant="ghost" asChild>
                    <Link to="/accounts">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Accounts
                    </Link>
                </Button>
            </div>
            {/* Account Summary Card */}
            <AccountSummaryCard
                accountName={account.name}
                accountType={account.type}
                balance={account.balance}
                institution={account.institution}
                accountNumber={account.accountNumber}
                lastUpdated={account.lastUpdated}
                animationDelay={0.1}
            />
            {/* Stats Grid */}
            <StatsGrid columns={3} className="mb-4">
                <StatCard
                    label="Total Income"
                    value={`$${totalIncome.toFixed(2)}`}
                    valueColor="text-green-600"
                    animationDelay={0.3}
                />
                <StatCard
                    label="Total Expenses"
                    value={`$${totalExpenses.toFixed(2)}`}
                    valueColor="text-red-600"
                    animationDelay={0.35}
                />
                <StatCard label="Transactions" value={transactionCount} animationDelay={0.4} />
            </StatsGrid>
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <LineChartCard
                    title="Balance History"
                    description="Last 6 periods"
                    data={mockBalanceHistory}
                    xAxisKey="date"
                    series={[{ dataKey: 'balance', name: 'Balance', color: '#3b82f6' }]}
                    height={300}
                    animationDelay={0.45}
                />
                <BarChartCard
                    title="Monthly Activity"
                    description="Income vs Expenses"
                    data={mockMonthlyActivity}
                    xAxisKey="month"
                    series={[
                        { dataKey: 'income', name: 'Income', color: '#10b981' },
                        { dataKey: 'expenses', name: 'Expenses', color: '#ef4444' },
                    ]}
                    height={300}
                    animationDelay={0.5}
                />
            </div>
            {/* Recent Transactions */}
            <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h5 className="text-lg font-semibold flex items-center gap-2">
                            Recent Transactions
                            <Badge variant="secondary">{transactionCount}</Badge>
                        </h5>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link to={`/transactions?accountId=${accountId}`}>
                                    View All for This Account
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <Link to="/transactions">All Transactions</Link>
                            </Button>
                        </div>
                    </div>
                    {transactionCount === 0 ? (
                        <EmptyState
                            icon={Receipt}
                            title="No Transactions"
                            description="This account has no transaction history yet."
                        />
                    ) : (
                        <>
                            <SimpleTransactionTable
                                transactions={displayedTransactions}
                                animationDelay={0.55}
                            />
                            {transactionCount > 5 && (
                                <div className="text-center pt-3 border-t mt-4">
                                    {transactionsToShow < transactionCount ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setTransactionsToShow(transactionsToShow + 5)
                                            }
                                        >
                                            Show More ({transactionCount - transactionsToShow}{' '}
                                            remaining)
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setTransactionsToShow(5)}
                                        >
                                            Show Less
                                        </Button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
            {/* Modals */}
            <EditAccountModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                account={account}
                onConfirm={handleEditAccountWrapper}
            />
            <DeleteAccountModal
                open={showDeleteModal}
                onOpenChange={setShowDeleteModal}
                accountId={account.id}
                accountName={account.name}
                onConfirm={handleDeleteAccount}
            />
            <ArchiveAccountModal
                open={showArchiveModal}
                onOpenChange={setShowArchiveModal}
                accountId={account.id}
                accountName={account.name}
                onConfirm={handleArchiveAccount}
            />
            <RestoreAccountModal
                open={showRestoreModal}
                onOpenChange={setShowRestoreModal}
                accountId={account.id}
                accountName={account.name}
                onConfirm={handleRestoreAccount}
            />
        </div>
    );
}
