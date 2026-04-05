import type { AccountFormData } from '../../components/account';
import type UseAccountsReturn from './UseAccountsReturn';
import { useState, useMemo, useCallback } from 'react';
import type { SortOption } from './sort-option';
import type { Account } from '../../data';

export interface UseAccountsOptions {
    accounts: Account[];
    onCreateAccount?: (data: AccountFormData) => void;
    onEditAccount?: (id: number, data: AccountFormData) => void;
    onDeleteAccount?: (id: number) => void;
    onArchiveAccount?: (id: number) => void;
    onRestoreAccount?: (id: number) => void;
    onBulkDelete?: (ids: number[]) => void;
    onTransfer?: (fromId: number, toId: number, amount: number, description: string) => void;
}

export default function useAccounts({
    accounts,
    onCreateAccount,
    onEditAccount,
    onDeleteAccount,
    onArchiveAccount,
    onRestoreAccount,
    onBulkDelete,
    onTransfer,
}: UseAccountsOptions): UseAccountsReturn {
    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    // Selected account/accounts
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [selectedAccounts, setSelectedAccounts] = useState<Set<number>>(new Set());
    // Search and filter
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<Account['type'] | 'All'>('All');
    const [sortBy, setSortBy] = useState<SortOption>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [showArchived, setShowArchived] = useState(false);
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredAccounts = useMemo(() => {
        const filtered = accounts.filter((account) => {
            const matchesSearch =
                account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                account.institution?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === 'All' || account.type === filterType;
            const matchesArchived = showArchived ? account.archived : !account.archived;
            return matchesSearch && matchesType && matchesArchived;
        });
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'balance':
                    comparison = a.balance - b.balance;
                    break;
                case 'type':
                    comparison = a.type.localeCompare(b.type);
                    break;
                case 'date':
                    comparison =
                        new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
                    break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });
        return filtered;
    }, [accounts, searchQuery, filterType, showArchived, sortBy, sortDirection]);

    const paginatedAccounts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAccounts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAccounts, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

    const stats = useMemo(() => {
        const active = accounts.filter((a) => !a.archived);
        const totalBalance = active.reduce((sum, a) => sum + (a.balance > 0 ? a.balance : 0), 0);
        const totalDebt = Math.abs(
            active.reduce((sum, a) => sum + (a.balance < 0 ? a.balance : 0), 0)
        );
        const netWorth = active.reduce((sum, a) => sum + a.balance, 0);
        return { totalBalance, totalDebt, netWorth, totalAccounts: active.length };
    }, [accounts]);

    const toggleAccountSelection = useCallback(
        (id: number) => {
            const newSelection = new Set(selectedAccounts);
            if (newSelection.has(id)) {
                newSelection.delete(id);
            } else {
                newSelection.add(id);
            }
            setSelectedAccounts(newSelection);
        },
        [selectedAccounts]
    );

    const toggleSelectAll = useCallback(() => {
        if (selectedAccounts.size === paginatedAccounts.length) {
            setSelectedAccounts(new Set());
        } else {
            setSelectedAccounts(new Set(paginatedAccounts.map((a) => a.id)));
        }
    }, [selectedAccounts.size, paginatedAccounts]);

    const clearSelection = useCallback(() => {
        setSelectedAccounts(new Set());
    }, []);

    const handleCreateAccount = useCallback(
        (data: AccountFormData) => {
            onCreateAccount?.(data);
            setShowCreateModal(false);
        },
        [onCreateAccount]
    );

    const handleEditAccount = useCallback(
        (id: number, data: AccountFormData) => {
            onEditAccount?.(id, data);
            setShowEditModal(false);
            setSelectedAccount(null);
        },
        [onEditAccount]
    );

    const handleDeleteAccount = useCallback(
        (id: number) => {
            onDeleteAccount?.(id);
            setShowDeleteModal(false);
            setSelectedAccount(null);
            clearSelection();
        },
        [onDeleteAccount, clearSelection]
    );

    const handleArchiveAccount = useCallback(
        (id: number) => {
            onArchiveAccount?.(id);
            setShowArchiveModal(false);
            setSelectedAccount(null);
            clearSelection();
        },
        [onArchiveAccount, clearSelection]
    );

    const handleRestoreAccount = useCallback(
        (id: number) => {
            onRestoreAccount?.(id);
            setShowRestoreModal(false);
            setSelectedAccount(null);
            clearSelection();
        },
        [onRestoreAccount, clearSelection]
    );

    const handleBulkDelete = useCallback(() => {
        const ids = Array.from(selectedAccounts);
        onBulkDelete?.(ids);
        clearSelection();
        setShowBulkDeleteModal(false);
    }, [selectedAccounts, onBulkDelete, clearSelection]);

    const handleTransfer = useCallback(
        (fromId: number, toId: number, amount: number, description: string) => {
            onTransfer?.(fromId, toId, amount, description);
            setShowTransferModal(false);
        },
        [onTransfer]
    );

    return {
        // Modal states
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
        // Selected account/accounts
        selectedAccount,
        selectedAccounts,
        setSelectedAccount,
        // Search and filter
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
        // Pagination
        currentPage,
        itemsPerPage,
        totalPages,
        setCurrentPage,
        // Filtered and processed data
        filteredAccounts,
        paginatedAccounts,
        // Statistics
        stats,
        // Selection handlers
        toggleAccountSelection,
        toggleSelectAll,
        clearSelection,
        // Action handlers
        handleCreateAccount,
        handleEditAccount,
        handleDeleteAccount,
        handleArchiveAccount,
        handleRestoreAccount,
        handleBulkDelete,
        handleTransfer,
    };
}
