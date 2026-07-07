import type { Account, SortOption } from '../../types';

export default interface UseAccountsReturn {
    // Modal states
    showCreateModal: boolean;
    showEditModal: boolean;
    showDeleteModal: boolean;
    showArchiveModal: boolean;
    showRestoreModal: boolean;
    showBulkDeleteModal: boolean;
    showTransferModal: boolean;
    setShowCreateModal: (show: boolean) => void;
    setShowEditModal: (show: boolean) => void;
    setShowDeleteModal: (show: boolean) => void;
    setShowArchiveModal: (show: boolean) => void;
    setShowRestoreModal: (show: boolean) => void;
    setShowBulkDeleteModal: (show: boolean) => void;
    setShowTransferModal: (show: boolean) => void;
    // Selected accounts/account
    selectedAccount: Account | null;
    selectedAccounts: Set<number>;
    setSelectedAccount: (account: Account | null) => void;
    // Search and filter
    searchQuery: string;
    filterType: Account['type'] | 'All';
    sortBy: SortOption;
    sortDirection: 'asc' | 'desc';
    showArchived: boolean;
    setSearchQuery: (query: string) => void;
    setFilterType: (type: Account['type'] | 'All') => void;
    setSortBy: (sort: SortOption) => void;
    setSortDirection: (direction: 'asc' | 'desc') => void;
    setShowArchived: (show: boolean) => void;
    // Pagination
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    // Filtered and processed data
    filteredAccounts: Account[];
    paginatedAccounts: Account[];
    // Statistics
    stats: {
        totalAccounts: number;
        totalBalance: number;
        totalDebt: number;
        netWorth: number;
    };
    // Selection handlers
    toggleAccountSelection: (id: number) => void;
    toggleSelectAll: () => void;
    clearSelection: () => void;
    // Action handlers
    handleCreateAccount: (data: Account) => void;
    handleEditAccount: (id: number, data: Account) => void;
    handleDeleteAccount: (id: number) => void;
    handleArchiveAccount: (id: number) => void;
    handleRestoreAccount: (id: number) => void;
    handleBulkDelete: () => void;
    handleTransfer: (fromId: number, toId: number, amount: number, description: string) => void;
}
