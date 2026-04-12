import type { SortOption } from './SortOption';
import type { Transaction } from '../../data';

export interface UseTransactionsReturn {
    // Transactions data
    filteredAndSortedTransactions: Transaction[];
    paginatedTransactions: Transaction[];
    totalPages: number;

    // Modal states
    showCreateModal: boolean;
    setShowCreateModal: (show: boolean) => void;
    showEditModal: boolean;
    setShowEditModal: (show: boolean) => void;
    showDeleteModal: boolean;
    setShowDeleteModal: (show: boolean) => void;
    showBulkDeleteModal: boolean;
    setShowBulkDeleteModal: (show: boolean) => void;
    showBulkCategoryModal: boolean;
    setShowBulkCategoryModal: (show: boolean) => void;
    showDetailModal: boolean;
    setShowDetailModal: (show: boolean) => void;

    // Selection
    selectedTransaction: Transaction | null;
    setSelectedTransaction: (transaction: Transaction | null) => void;
    selectedTransactions: Set<number>;
    setSelectedTransactions: (selected: Set<number>) => void;

    // Filter states
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterType: Transaction['type'] | 'All';
    setFilterType: (type: Transaction['type'] | 'All') => void;
    filterCategory: string;
    setFilterCategory: (category: string) => void;
    filterAccount: number | 'All';
    setFilterAccount: (account: number | 'All') => void;
    dateRange: { start: string; end: string };
    setDateRange: (range: { start: string; end: string }) => void;

    // Sort states
    sortBy: SortOption;
    setSortBy: (sortBy: SortOption) => void;
    sortDirection: 'asc' | 'desc';
    setSortDirection: (direction: 'asc' | 'desc') => void;

    // Pagination
    currentPage: number;
    setCurrentPage: (page: number) => void;
    itemsPerPage: number;
    setItemsPerPage: (perPage: number) => void;

    // Export states
    isExporting: boolean;
    showExportMenu: boolean;
    setShowExportMenu: (show: boolean) => void;

    // Computed values
    hasActiveFilters: boolean;
    allCategories: string[];

    // Export helpers
    handleExportCSV: () => void;
    handleExportPDF: () => void;
    formatDate: (dateString: string) => string;

    // Utility
    clearFilters: () => void;
    toggleSelectAll: () => void;
    toggleSelect: (id: number) => void;
}
