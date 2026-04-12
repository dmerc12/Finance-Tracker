import type { TransactionFormData } from '../../components/transactions';
import { useState, useCallback } from 'react';
import {
    type Transaction,
    mockTransactions as initialTransactions,
    mockAccounts as accountsData,
} from '../../data';

export default function useManageTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

    const createTransaction = useCallback(
        (formData: TransactionFormData) => {
            const fromAccount = accountsData.find((a) => a.id === formData.accountId);
            const toAccount = formData.toAccountId
                ? accountsData.find((a) => a.id === formData.toAccountId)
                : undefined;
            const newTransaction: Transaction = {
                id: Math.max(...transactions.map((t) => t.id), 0) + 1,
                description: formData.description,
                amount: formData.amount,
                type: formData.type,
                category: formData.category,
                accountId: formData.accountId,
                accountName: fromAccount?.name || '',
                date: formData.date,
                notes: formData.notes,
                ...(formData.type === 'transfer' && {
                    toAccountId: formData.toAccountId,
                    toAccountName: toAccount?.name || '',
                }),
            };
            setTransactions((prev) => [newTransaction, ...prev]);
            return newTransaction;
        },
        [transactions]
    );

    const updateTransaction = useCallback((id: number, formData: TransactionFormData) => {
        const fromAccount = accountsData.find((a) => a.id === formData.accountId);
        const toAccount = formData.toAccountId
            ? accountsData.find((a) => a.id === formData.toAccountId)
            : undefined;
        setTransactions((prev) =>
            prev.map((transaction) =>
                transaction.id === id
                    ? {
                          ...transaction,
                          description: formData.description,
                          amount: formData.amount,
                          type: formData.type,
                          category: formData.category,
                          accountId: formData.accountId,
                          accountName: fromAccount?.name || '',
                          date: formData.date,
                          notes: formData.notes,
                          ...(formData.type === 'transfer' && {
                              toAccountId: formData.toAccountId,
                              toAccountName: toAccount?.name || '',
                          }),
                      }
                    : transaction
            )
        );
    }, []);

    const deleteTransaction = useCallback((id: number) => {
        setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
    }, []);

    const bulkDelete = useCallback((ids: number[]) => {
        setTransactions((prev) => prev.filter((transaction) => !ids.includes(transaction.id)));
    }, []);

    const bulkUpdateCategory = useCallback((ids: number[], category: string) => {
        setTransactions((prev) =>
            prev.map((transaction) =>
                ids.includes(transaction.id) ? { ...transaction, category } : transaction
            )
        );
    }, []);

    const getTransactionById = useCallback(
        (id: number) => {
            return transactions.find((transaction) => transaction.id === id);
        },
        [transactions]
    );

    return {
        transactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        bulkDelete,
        bulkUpdateCategory,
        getTransactionById,
    };
}
