import { StatsGrid, StatCard } from '../components/common';
import { useAccounts, useManageAccounts } from '../hooks';
import React, { useEffect, type ReactNode } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Account, SortOption } from '../types';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Checkbox,
    Input,
} from '../components/ui';
import {
    AccountCard,
    CreateAccountModal,
    EditAccountModal,
    DeleteAccountModal,
    ArchiveAccountModal,
    RestoreAccountModal,
    TransferModal,
} from '../components/accounts';
import {
    Plus,
    Search,
    ArrowUpDown,
    Archive,
    ArchiveRestore,
    ArrowRightLeft,
    ChevronLeft,
    ChevronRight,
    Trash2,
} from 'lucide-react';

const Accounts: React.FC = () => {
    const {
        accounts,
        createAccount,
        updateAccount,
        deleteAccount,
        archiveAccount,
        restoreAccount,
        bulkDelete,
        transfer,
    } = useManageAccounts();

    const {
        showCreateModal,
        showEditModal,
        showDeleteModal,
        showArchiveModal,
        showRestoreModal,
        showBulkDeleteModal,
        showTransferModal,
        setShowCreateModal,
        setShowEditModal,
        setShowDeleteModal,
        setShowArchiveModal,
        setShowRestoreModal,
        setShowBulkDeleteModal,
        setShowTransferModal,
        selectedAccount,
        selectedAccounts,
        setSelectedAccount,
        searchQuery,
        filterType,
        sortBy,
        sortDirection,
        showArchived,
        setSearchQuery,
        setFilterType,
        setSortBy,
        setSortDirection,
        setShowArchived,
        currentPage,
        itemsPerPage,
        totalPages,
        setCurrentPage,
        filteredAccounts,
        paginatedAccounts,
        stats,
        toggleAccountSelection,
        toggleSelectAll,
        clearSelection,
        handleCreateAccount,
        handleEditAccount,
        handleDeleteAccount,
        handleArchiveAccount,
        handleRestoreAccount,
        handleBulkDelete,
        handleTransfer,
    } = useAccounts({
        accounts,
        onCreateAccount: createAccount,
        onEditAccount: updateAccount,
        onDeleteAccount: deleteAccount,
        onArchiveAccount: archiveAccount,
        onRestoreAccount: restoreAccount,
        onBulkDelete: bulkDelete,
        onTransfer: transfer,
    });

    const { setHeaderActions } = useOutletContext<{
        setHeaderActions: (actions: ReactNode) => void;
    }>();

    useEffect(() => {
        setHeaderActions(
            <>
                <Button onClick={() => setShowTransferModal(true)}>
                    <ArrowRightLeft size={18} className="mr-2" />
                    Transfer
                </Button>
                <Button onClick={() => setShowCreateModal(true)}>
                    <Plus size={18} className="mr-2" />
                    New Account
                </Button>
            </>
        );
        return () => setHeaderActions(null);
    }, [setHeaderActions, setShowTransferModal, setShowCreateModal]);

    return (
        <div className="space-y-4">
            {/* Stats Cards */}
            <StatsGrid columns={4} className="mb-6">
                <StatCard label="Total Accounts" value={stats.totalAccounts} animationDelay={0} />
                <StatCard
                    label="Total Balance"
                    value={`$${stats.totalBalance.toFixed(2)}`}
                    valueColor="text-green-600"
                    animationDelay={0.1}
                />
                <StatCard
                    label="Total Debt"
                    value={`$${stats.totalDebt.toFixed(2)}`}
                    valueColor="text-red-600"
                    animationDelay={0.2}
                />
                <StatCard
                    label="Net Worth"
                    value={`$${stats.netWorth.toFixed(2)}`}
                    animationDelay={0.3}
                />
            </StatsGrid>
            {/* Filters and Search */}
            <Card className="mb-4">
                <CardContent className="pt-6 pb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search accounts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select
                            value={filterType}
                            onValueChange={(value) => setFilterType(value as typeof filterType)}
                        >
                            <SelectTrigger className="w-ful md:w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All types</SelectItem>
                                <SelectItem value="Checking">Checking</SelectItem>
                                <SelectItem value="Savings">Savings</SelectItem>
                                <SelectItem value="Credit">Credit Card</SelectItem>
                                <SelectItem value="Investment">Investment</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={sortBy}
                            onValueChange={(value) => setSortBy(value as SortOption)}
                        >
                            <SelectTrigger className="w-ful md:w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Sort by Name</SelectItem>
                                <SelectItem value="balance">Sort by Balance</SelectItem>
                                <SelectItem value="type">Sort by Type</SelectItem>
                                <SelectItem value="date">Sort by Date</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                            }
                        >
                            <ArrowUpDown size={18} />
                            {sortDirection === 'asc' ? 'Asc' : 'Desc'}
                        </Button>
                        <Button
                            variant={showArchived ? 'default' : 'outline'}
                            onClick={() => {
                                setShowArchived(!showArchived);
                                setCurrentPage(1);
                            }}
                        >
                            {showArchived ? <ArchiveRestore size={18} /> : <Archive size={18} />}
                            {showArchived ? 'Active' : 'Archived'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            {/* Bulk Actions */}
            {selectedAccounts.size > 0 && (
                <Card className="mb-4 bg-blue-50 border-blue-200">
                    <CardContent className="pt-6 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Checkbox checked={true} onCheckedChange={clearSelection} />
                                <span className="font-semibold">
                                    {selectedAccounts.size} selected
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowBulkDeleteModal(true)}
                                >
                                    <Trash2 size={16} />
                                    Delete Selected
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            {/* Accounts List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>
                            {showArchived ? 'Archived Accounts' : 'Active Accounts'}(
                            {filteredAccounts.length})
                        </CardTitle>
                        {paginatedAccounts.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={selectedAccounts.size === paginatedAccounts.length}
                                    onCheckedChange={toggleSelectAll}
                                />
                                <span className="text-sm text-muted-foreground">Select All</span>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {paginatedAccounts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No accounts found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                            {paginatedAccounts.map((account, index) => (
                                <AccountCard
                                    key={account.id}
                                    account={account}
                                    index={index}
                                    isSelected={selectedAccounts.has(account.id)}
                                    onSelect={toggleAccountSelection}
                                    onEdit={(acc: Account) => {
                                        setSelectedAccount(acc);
                                        setShowEditModal(true);
                                    }}
                                    onDelete={(acc: Account) => {
                                        setSelectedAccount(acc);
                                        setShowDeleteModal(true);
                                    }}
                                    onArchive={
                                        !showArchived
                                            ? (acc: Account) => {
                                                  setSelectedAccount(acc);
                                                  setShowArchiveModal(true);
                                              }
                                            : undefined
                                    }
                                    onRestore={
                                        showArchived
                                            ? (acc: Account) => {
                                                  setSelectedAccount(acc);
                                                  setShowRestoreModal(true);
                                              }
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                    )}
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-6 pb-4 border-t">
                            <div className="text-sm text-muted-foreground">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                {Math.min(currentPage * itemsPerPage, filteredAccounts.length)} of{' '}
                                {filteredAccounts.length}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                        (page) => (
                                            <Button
                                                key={page}
                                                variant={
                                                    page === currentPage ? 'default' : 'outline'
                                                }
                                                size="sm"
                                                onClick={() => setCurrentPage(page)}
                                                className="w-10"
                                            >
                                                {page}
                                            </Button>
                                        )
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Modals */}
            <CreateAccountModal
                open={showCreateModal}
                onOpenChange={setShowCreateModal}
                onConfirm={handleCreateAccount}
            />
            <EditAccountModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                account={selectedAccount}
                onConfirm={(data) => {
                    if (selectedAccount) {
                        handleEditAccount(selectedAccount.id, data);
                    }
                }}
            />
            <DeleteAccountModal
                open={showDeleteModal}
                onOpenChange={setShowDeleteModal}
                accountId={selectedAccount?.id ?? 0}
                accountName={selectedAccount?.name ?? ''}
                onConfirm={() => selectedAccount && handleDeleteAccount(selectedAccount.id)}
            />
            <ArchiveAccountModal
                open={showArchiveModal}
                onOpenChange={setShowArchiveModal}
                accountId={selectedAccount?.id ?? 0}
                accountName={selectedAccount?.name ?? ''}
                onConfirm={() => selectedAccount && handleArchiveAccount(selectedAccount.id)}
            />
            <RestoreAccountModal
                open={showRestoreModal}
                onOpenChange={setShowRestoreModal}
                accountId={selectedAccount?.id ?? 0}
                accountName={selectedAccount?.name ?? ''}
                onConfirm={() => selectedAccount && handleRestoreAccount(selectedAccount.id)}
            />
            <TransferModal
                open={showTransferModal}
                onOpenChange={setShowTransferModal}
                accounts={accounts}
                onConfirm={handleTransfer}
            />
            {/* Bulk Delete Modal */}
            {showBulkDeleteModal && (
                <Dialog open={showBulkDeleteModal} onOpenChange={setShowBulkDeleteModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Multiple Accounts</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete {selectedAccounts.size} account(s)?
                                This action cannot be undone
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowBulkDeleteModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleBulkDelete}>
                                Delete {selectedAccounts.size} Account(s)
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Accounts;
