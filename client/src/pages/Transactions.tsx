import { useManageTransactions, useTransactions } from '../hooks';
import { mockAccounts as mockAccounts } from '../data';
import { Button, Card, CardContent } from '../components/ui';
import React, { useEffect, type ReactNode } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
    CreateTransactionModal,
    EditTransactionModal,
    DeleteTransactionModal,
    TransactionDetailsModal,
    BulkDeleteTransactionModal,
    BulkCategoryModal,
    TransactionTable,
    TransactionFilters,
    BulkActionsBar,
    TransactionsPagination,
    ExportMenu,
    AccountFilterBanner,
    type TransactionFormData,
} from '../components/transactions';

const Transactions: React.FC = () => {
    const { setHeaderActions } = useOutletContext<{
        setHeaderActions: (actions: ReactNode) => void;
    }>();

    const {
        transactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        bulkDelete,
        bulkUpdateCategory,
    } = useManageTransactions();

    const {
        filteredAndSortedTransactions,
        paginatedTransactions,
        totalPages,
        showCreateModal,
        setShowCreateModal,
        showEditModal,
        setShowEditModal,
        showDeleteModal,
        setShowDeleteModal,
        showBulkDeleteModal,
        setShowBulkDeleteModal,
        showBulkCategoryModal,
        setShowBulkCategoryModal,
        showDetailModal,
        setShowDetailModal,
        selectedTransaction,
        setSelectedTransaction,
        selectedTransactions,
        setSelectedTransactions,
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        filterCategory,
        setFilterCategory,
        filterAccount,
        setFilterAccount,
        dateRange,
        setDateRange,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        isExporting,
        showExportMenu,
        setShowExportMenu,
        hasActiveFilters,
        allCategories,
        handleExportCSV,
        handleExportPDF,
        formatDate,
        clearFilters,
        toggleSelectAll,
        toggleSelect,
    } = useTransactions({ transactions });

    const handleCreate = (formData: TransactionFormData) => {
        createTransaction(formData);
        setShowCreateModal(false);
    };

    const handleEdit = (formData: TransactionFormData) => {
        if (selectedTransaction) {
            updateTransaction(selectedTransaction.id, formData);
            setShowEditModal(false);
            setSelectedTransaction(null);
        }
    };

    const handleDelete = () => {
        if (selectedTransaction) {
            deleteTransaction(selectedTransaction.id);
            setShowDeleteModal(false);
            setSelectedTransaction(null);
        }
    };

    const handleBulkDelete = () => {
        const ids = Array.from(selectedTransactions);
        bulkDelete(ids);
        setSelectedTransactions(new Set());
        setShowBulkDeleteModal(false);
    };

    const handleBulkCategory = (category: string) => {
        const ids = Array.from(selectedTransactions);
        bulkUpdateCategory(ids, category);
        setSelectedTransactions(new Set());
        setShowBulkCategoryModal(false);
    };

    useEffect(() => {
        setHeaderActions(
            <div className="flex items-center gap-2">
                <ExportMenu
                    isExporting={isExporting}
                    showExportMenu={showExportMenu}
                    selectedCount={selectedTransactions.size}
                    filteredCount={filteredAndSortedTransactions.length}
                    onToggleMenu={() => setShowExportMenu(!showExportMenu)}
                    onExportPDF={handleExportPDF}
                    onExportCSV={handleExportCSV}
                />
                <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                    <Plus size={18} className="mr-2" />
                    Add Transaction
                </Button>
            </div>
        );
    }, [
        setHeaderActions,
        isExporting,
        showExportMenu,
        selectedTransactions.size,
        filteredAndSortedTransactions.length,
        setShowExportMenu,
        handleExportPDF,
        handleExportCSV,
        setShowCreateModal,
    ]);

    return (
        <div className="space-y-4">
            {/* Account Filter Banner (shows when URL param filter is active) */}
            <AccountFilterBanner filterAccount={filterAccount} onClearFilter={clearFilters} />
            {/* Filters and Search */}
            <TransactionFilters
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                    setSearchQuery(q);
                    setCurrentPage(1);
                }}
                filterType={filterType}
                onFilterTypeChange={(t) => {
                    setFilterType(t);
                    setCurrentPage(1);
                }}
                filterCategory={filterCategory}
                onFilterCategoryChange={(c) => {
                    setFilterCategory(c);
                    setCurrentPage(1);
                }}
                filterAccount={filterAccount}
                onFilterAccountChange={(a) => {
                    setFilterAccount(a);
                    setCurrentPage(1);
                }}
                dateRange={dateRange}
                onDateRangeChange={(r) => {
                    setDateRange(r);
                    setCurrentPage(1);
                }}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                sortDirection={sortDirection}
                onSortDirectionChange={setSortDirection}
                allCategories={allCategories}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
            />
            {/* Bulk Actions Bar */}
            <BulkActionsBar
                selectedCount={selectedTransactions.size}
                onChangeCategoryClick={() => setShowBulkCategoryModal(true)}
                onDeleteClick={() => setShowBulkDeleteModal(true)}
                onClearSelection={() => setSelectedTransactions(new Set())}
            />
            {/* Transactions Table */}
            <Card>
                <CardContent className="p-0">
                    <TransactionTable
                        transactions={paginatedTransactions}
                        selectedTransactions={selectedTransactions}
                        onToggleSelect={toggleSelect}
                        onToggleSelectAll={toggleSelectAll}
                        onViewDetails={(txn) => {
                            setSelectedTransaction(txn);
                            setShowDetailModal(true);
                        }}
                        onEdit={(txn) => {
                            setSelectedTransaction(txn);
                            setShowEditModal(true);
                        }}
                        onDelete={(txn) => {
                            setSelectedTransaction(txn);
                            setShowDeleteModal(true);
                        }}
                        hasActiveFilters={hasActiveFilters}
                        formatDate={formatDate}
                    />
                </CardContent>
                {/* Pagination */}
                <TransactionsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredAndSortedTransactions.length}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(perPage) => {
                        setItemsPerPage(perPage);
                        setCurrentPage(1);
                    }}
                />
            </Card>
            {/* Modals */}
            <CreateTransactionModal
                open={showCreateModal}
                onOpenChange={setShowCreateModal}
                onConfirm={handleCreate}
                accounts={mockAccounts}
            />
            <EditTransactionModal
                key={showEditModal ? selectedTransaction?.id : 'closed'}
                open={showEditModal}
                onOpenChange={setShowEditModal}
                transaction={selectedTransaction}
                onConfirm={handleEdit}
                accounts={mockAccounts}
            />
            <TransactionDetailsModal
                open={showDetailModal}
                onOpenChange={setShowDetailModal}
                transaction={selectedTransaction}
                onEdit={(txn) => {
                    setSelectedTransaction(txn);
                    setShowDetailModal(false);
                    setShowEditModal(true);
                }}
                onDelete={(txn) => {
                    setSelectedTransaction(txn);
                    setShowDetailModal(false);
                    setShowDeleteModal(true);
                }}
            />
            <DeleteTransactionModal
                open={showDeleteModal}
                onOpenChange={setShowDeleteModal}
                transaction={selectedTransaction}
                onConfirm={handleDelete}
            />
            <BulkDeleteTransactionModal
                open={showBulkDeleteModal}
                onOpenChange={setShowBulkDeleteModal}
                selectedCount={selectedTransactions.size}
                onConfirm={handleBulkDelete}
            />
            <BulkCategoryModal
                open={showBulkCategoryModal}
                onOpenChange={setShowBulkCategoryModal}
                selectedCount={selectedTransactions.size}
                onConfirm={handleBulkCategory}
            />
        </div>
    );
};

export default Transactions;
