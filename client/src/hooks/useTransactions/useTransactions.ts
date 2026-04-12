import type { UseTransactionsReturn } from './UseTransactionsReturn';
import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SortOption } from './SortOption';
import {
    type Transaction,
    incomeCategories,
    expenseCategories,
    transferCategory,
} from '../../data';

export interface UseTransactionsOptions {
    transactions: Transaction[];
}

export default function useTransactions({
    transactions,
}: UseTransactionsOptions): UseTransactionsReturn {
    const [searchParams, setSearchParams] = useSearchParams();

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const [showBulkCategoryModal, setShowBulkCategoryModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Selection
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [selectedTransactions, setSelectedTransactions] = useState<Set<number>>(new Set());

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<Transaction['type'] | 'All'>('All');
    const [filterCategory, setFilterCategory] = useState<string>('All');
    const [filterAccountOverride, setFilterAccountOverride] = useState<number | 'All' | null>(null);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // Sort states
    const [sortBy, setSortBy] = useState<SortOption>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Export states
    const [isExporting, setIsExporting] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Apply URL query parameter filters
    const filterAccount = useMemo(() => {
        const urlAccountId = searchParams.get('accountId');
        if (urlAccountId) {
            const numericId = Number(urlAccountId);
            if (!Number.isNaN(numericId)) return numericId;
        }
        return filterAccountOverride ?? 'All';
    }, [searchParams, filterAccountOverride]);

    const setFilterAccount = useCallback((account: number | 'All') => {
        setFilterAccountOverride(account);
    }, []);

    // Get all categories for filtering
    const allCategories = useMemo(
        () => [...incomeCategories, ...expenseCategories, ...transferCategory],
        []
    );

    // Filtering and Sorting
    const filteredAndSortedTransactions = useMemo(() => {
        const filtered = transactions.filter((transaction) => {
            const matchesSearch =
                transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.notes?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === 'All' || transaction.type === filterType;
            const matchesCategory =
                filterCategory === 'All' || transaction.category === filterCategory;
            const matchesAccount =
                filterAccount === 'All' || transaction.accountId === filterAccount;

            let matchesDateRange = true;
            if (dateRange.start) {
                matchesDateRange = matchesDateRange && transaction.date >= dateRange.start;
            }
            if (dateRange.end) {
                matchesDateRange = matchesDateRange && transaction.date <= dateRange.end;
            }

            return (
                matchesSearch &&
                matchesType &&
                matchesCategory &&
                matchesAccount &&
                matchesDateRange
            );
        });

        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                    break;
                case 'amount':
                    comparison = a.amount - b.amount;
                    break;
                case 'category':
                    comparison = a.category.localeCompare(b.category);
                    break;
                case 'description':
                    comparison = a.description.localeCompare(b.description);
                    break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [
        transactions,
        searchQuery,
        filterType,
        filterCategory,
        filterAccount,
        dateRange,
        sortBy,
        sortDirection,
    ]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
    const paginatedTransactions = useMemo(
        () =>
            filteredAndSortedTransactions.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
            ),
        [filteredAndSortedTransactions, currentPage, itemsPerPage]
    );

    // Selection helpers
    const toggleSelectAll = useCallback(() => {
        if (selectedTransactions.size === paginatedTransactions.length) {
            setSelectedTransactions(new Set());
        } else {
            setSelectedTransactions(new Set(paginatedTransactions.map((txn) => txn.id)));
        }
    }, [selectedTransactions, paginatedTransactions]);

    const toggleSelect = useCallback((id: number) => {
        setSelectedTransactions((prev) => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    }, []);

    const clearFilters = useCallback(() => {
        if (searchParams.get('accountId')) {
            const params = new URLSearchParams(searchParams);
            params.delete('accountId');
            setSearchParams(params);
        }
        setSearchQuery('');
        setFilterType('All');
        setFilterCategory('All');
        setFilterAccountOverride('All');
        setDateRange({ start: '', end: '' });
        setCurrentPage(1);
    }, [searchParams, setSearchParams]);

    const hasActiveFilters =
        searchQuery !== '' ||
        filterType !== 'All' ||
        filterCategory !== 'All' ||
        filterAccount !== 'All' ||
        dateRange.start !== '' ||
        dateRange.end !== '';

    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }, []);

    // Determine which transactions to export: selected ones first, else all filtered
    const getExportTransactions = useCallback(() => {
        if (selectedTransactions.size > 0) {
            return filteredAndSortedTransactions.filter((t) => selectedTransactions.has(t.id));
        }
        return filteredAndSortedTransactions;
    }, [selectedTransactions, filteredAndSortedTransactions]);

    const handleExportCSV = useCallback(() => {
        setShowExportMenu(false);
        setIsExporting(true);
        setTimeout(() => {
            const rows = getExportTransactions();
            const header = 'ID,Date,Description,Type,Category,Account,Amount,To Account,Notes';
            const lines = rows.map((t) =>
                [
                    t.id,
                    t.date,
                    `"${t.description.replace(/"/g, '""')}"`,
                    t.type,
                    t.category,
                    `"${t.accountName}"`,
                    t.type === 'expense' ? -t.amount : t.amount,
                    t.toAccountName ?? '',
                    `"${(t.notes ?? '').replace(/"/g, '""')}"`,
                ].join(',')
            );
            const csv = [header, ...lines].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setIsExporting(false);
        }, 800);
    }, [getExportTransactions]);

    const handleExportPDF = useCallback(() => {
        setShowExportMenu(false);
        setIsExporting(true);
        setTimeout(() => {
            alert('PDF report generated! (Demo — in production this would download a PDF)');
            setIsExporting(false);
        }, 1200);
    }, []);

    return {
        // Transactions data
        filteredAndSortedTransactions,
        paginatedTransactions,
        totalPages,

        // Modal states
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

        // Selection
        selectedTransaction,
        setSelectedTransaction,
        selectedTransactions,
        setSelectedTransactions,

        // Filter states
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

        // Sort states
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,

        // Pagination
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,

        // Export states
        isExporting,
        showExportMenu,
        setShowExportMenu,

        // Computed values
        hasActiveFilters,
        allCategories,

        // Utility
        toggleSelectAll,
        toggleSelect,
        clearFilters,

        // Export helpers
        handleExportCSV,
        handleExportPDF,
        formatDate,
    };
}
