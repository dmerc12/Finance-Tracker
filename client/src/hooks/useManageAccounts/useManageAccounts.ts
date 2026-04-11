import { type Account, mockAccounts as initialAccounts } from '../../data';
import { useState, useCallback } from 'react';

export interface AccountFormData {
    name: string;
    type: 'Checking' | 'Savings' | 'Credit' | 'Investment';
    balance: number;
    institution: string;
    accountNumber: string;
}

export default function useManageAccounts() {
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts);

    const createAccount = useCallback(
        (formData: AccountFormData) => {
            const newAccount: Account = {
                id: Math.max(...accounts.map((a) => a.id), 0) + 1,
                name: formData.name,
                type: formData.type,
                balance: formData.balance,
                institution: formData.institution,
                accountNumber: formData.accountNumber,
                lastUpdated: new Date().toISOString().split('T')[0],
                archived: false,
            };
            setAccounts((prev) => [...prev, newAccount]);
        },
        [accounts]
    );

    const updateAccount = useCallback((id: number, formData: Account) => {
        setAccounts((prev) =>
            prev.map((account) =>
                account.id === id
                    ? {
                          ...account,
                          name: formData.name,
                          type: formData.type,
                          balance: formData.balance,
                          institution: formData.institution,
                          accountNumber: formData.accountNumber,
                          lastUpdated: new Date().toISOString().split('T')[0],
                      }
                    : account
            )
        );
    }, []);

    const deleteAccount = useCallback((id: number) => {
        setAccounts((prev) => prev.filter((account) => account.id !== id));
    }, []);

    const archiveAccount = useCallback((id: number) => {
        setAccounts((prev) =>
            prev.map((account) => (account.id === id ? { ...account, archived: true } : account))
        );
    }, []);

    const restoreAccount = useCallback((id: number) => {
        setAccounts((prev) =>
            prev.map((account) => (account.id === id ? { ...account, archived: false } : account))
        );
    }, []);

    const bulkDelete = useCallback((ids: number[]) => {
        setAccounts((prev) => prev.filter((account) => !ids.includes(account.id)));
    }, []);

    const transfer = useCallback((fromId: number, toId: number, amount: number) => {
        setAccounts((prev) =>
            prev.map((account) => {
                if (account.id === fromId) {
                    return { ...account, balance: account.balance - amount };
                }
                if (account.id === toId) {
                    return { ...account, balance: account.balance + amount };
                }
                return account;
            })
        );
    }, []);

    const getAccountById = useCallback(
        (id: number) => {
            return accounts.find((account) => account.id === id);
        },
        [accounts]
    );

    const getStats = useCallback(() => {
        const activeAccounts = accounts.filter((a) => !a.archived);
        const totalBalance = activeAccounts
            .filter((a) => a.type !== 'Credit')
            .reduce((sum, a) => sum + a.balance, 0);
        const totalDebt = activeAccounts
            .filter((a) => a.type === 'Credit' && a.balance < 0)
            .reduce((sum, a) => sum + Math.abs(a.balance), 0);
        const netWorth = totalBalance - totalDebt;

        return {
            totalAccounts: activeAccounts.length,
            totalBalance,
            totalDebt,
            netWorth,
        };
    }, [accounts]);

    return {
        accounts,
        createAccount,
        updateAccount,
        deleteAccount,
        archiveAccount,
        restoreAccount,
        bulkDelete,
        transfer,
        getAccountById,
        getStats,
    };
}
