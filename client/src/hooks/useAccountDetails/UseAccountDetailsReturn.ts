import type { SimpleTransaction, Account } from '../../data';

export default interface UseAccountDetailsReturn {
    // Modal States
    showEditModal: boolean;
    showDeleteModal: boolean;
    showArchiveModal: boolean;
    showRestoreModal: boolean;
    setShowEditModal: (show: boolean) => void;
    setShowDeleteModal: (show: boolean) => void;
    setShowArchiveModal: (show: boolean) => void;
    setShowRestoreModal: (show: boolean) => void;

    // Transaction Display
    transactionsToShow: number;
    displayedTransactions: SimpleTransaction[];
    setTransactionsToShow: (count: number) => void;

    // Calculations
    totalIncome: number;
    totalExpenses: number;
    transactionCount: number;

    // Handlers
    handleEditAccount: (formData: Account) => void;
    handleDeleteAccount: () => void;
    handleArchiveAccount: () => void;
    handleRestoreAccount: () => void;
}
