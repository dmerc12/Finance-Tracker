import type UseAccountDetailsOptions from './UseAccountDetailsOptions';
import type UseAccountDetailsReturn from './UseAccountDetailsReturn';
import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Account } from '../../data';

/**
 * Custom hook for managing AccountDetails page state and logic
 * Handles modal states, transaction display, calculations, and action handlers
 */
export default function useAccountDetails({
    account,
    allTransactions,
    onAccountUpdate,
    onAccountDelete,
}: UseAccountDetailsOptions): UseAccountDetailsReturn {
    const navigate = useNavigate();

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);

    // Transaction display state
    const [transactionsToShow, setTransactionsToShow] = useState(5);

    // Filter transactions for this account
    const accountTransactions = useMemo(
        () => allTransactions.filter((t) => t.accountId === account?.id),
        [allTransactions, account?.id]
    );

    // Displayed transactions (sliced based on transactionsToShow)
    const displayedTransactions = useMemo(
        () => accountTransactions.slice(0, transactionsToShow),
        [accountTransactions, transactionsToShow]
    );

    // Calculate totals
    const totalIncome = useMemo(
        () =>
            Math.abs(
                accountTransactions
                    .filter((t) => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0)
            ),
        [accountTransactions]
    );

    const totalExpenses = useMemo(
        () =>
            Math.abs(
                accountTransactions
                    .filter((t) => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0)
            ),
        [accountTransactions]
    );

    const transactionCount = accountTransactions.length;

    // Action handlers
    const handleEditAccount = useCallback(
        (formData: Account) => {
            if (!account) return;

            const updatedAccount: Account = {
                ...account,
                name: formData.name,
                type: formData.type,
                balance: Number(formData.balance),
                institution: formData.institution,
                accountNumber: formData.accountNumber,
            };

            onAccountUpdate?.(updatedAccount);
            setShowEditModal(false);
        },
        [account, onAccountUpdate]
    );

    const handleDeleteAccount = useCallback(() => {
        onAccountDelete?.();
        setShowDeleteModal(false);
        navigate('/accounts');
    }, [onAccountDelete, navigate]);

    const handleArchiveAccount = useCallback(() => {
        if (!account) return;
        const updatedAccount: Account = { ...account, archived: true };
        onAccountUpdate?.(updatedAccount);
        setShowArchiveModal(false);
    }, [account, onAccountUpdate]);

    const handleRestoreAccount = useCallback(() => {
        if (!account) return;
        const updatedAccount: Account = { ...account, archived: false };
        onAccountUpdate?.(updatedAccount);
        setShowRestoreModal(false);
    }, [account, onAccountUpdate]);

    return {
        // Modal states
        showEditModal,
        showDeleteModal,
        showArchiveModal,
        showRestoreModal,
        showAddTransactionModal,
        setShowEditModal,
        setShowDeleteModal,
        setShowArchiveModal,
        setShowRestoreModal,
        setShowAddTransactionModal,

        // Transaction display
        transactionsToShow,
        displayedTransactions,
        setTransactionsToShow,

        // Calculations
        totalIncome,
        totalExpenses,
        transactionCount,

        // Handlers
        handleEditAccount,
        handleDeleteAccount,
        handleArchiveAccount,
        handleRestoreAccount,
    };
}
