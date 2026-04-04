/**
 * Mock Transaction Data
 *
 * Central location for all mock transaction data used throughout the application.
 * Update this file when building the API to easily swap mock data for real API calls.
 */

export interface Transaction {
    id: number;
    description: string;
    amount: number;
    type: 'income' | 'expense' | 'transfer';
    category: string;
    accountId: number;
    accountName: string;
    date: string;
    notes?: string;
    toAccountId?: number;
    toAccountName?: string;
}

/**
 * Full transaction dataset for Transactions page
 */
export const mockTransactions: Transaction[] = [
    {
        id: 1,
        description: 'Salary Deposit',
        amount: 3500.0,
        type: 'income',
        category: 'Salary',
        accountId: 1,
        accountName: 'Chase Checking',
        date: '2026-02-20',
        notes: 'Monthly salary',
    },
    {
        id: 2,
        description: 'Grocery Store',
        amount: 85.43,
        type: 'expense',
        category: 'Food & Dining',
        accountId: 1,
        accountName: 'Chase Checking',
        date: '2026-02-19',
    },
    {
        id: 3,
        description: 'Netflix Subscription',
        amount: 15.99,
        type: 'expense',
        category: 'Entertainment',
        accountId: 3,
        accountName: 'Credit Card',
        date: '2026-02-18',
    },
    {
        id: 4,
        description: 'Gas Station',
        amount: 45.67,
        type: 'expense',
        category: 'Transportation',
        accountId: 1,
        accountName: 'Chase Checking',
        date: '2026-02-17',
    },
    {
        id: 5,
        description: 'Freelance Project',
        amount: 500.0,
        type: 'income',
        category: 'Business',
        accountId: 1,
        accountName: 'Chase Checking',
        date: '2026-02-16',
        notes: 'Website design project',
    },
    {
        id: 6,
        description: 'Electric Bill',
        amount: 120.5,
        type: 'expense',
        category: 'Bills & Utilities',
        accountId: 1,
        accountName: 'Chase Checking',
        date: '2026-02-15',
    },
    {
        id: 7,
        description: 'Coffee Shop',
        amount: 12.5,
        type: 'expense',
        category: 'Food & Dining',
        accountId: 1,
        accountName: 'Chase Checking',
        date: '2026-02-14',
    },
    {
        id: 8,
        description: 'Online Shopping',
        amount: 89.99,
        type: 'expense',
        category: 'Shopping',
        accountId: 3,
        accountName: 'Credit Card',
        date: '2026-02-13',
    },
    {
        id: 9,
        description: 'Transfer to Savings',
        amount: 1000.0,
        type: 'transfer',
        category: 'Transfer',
        accountId: 1,
        accountName: 'Chase Checking',
        toAccountId: 2,
        toAccountName: 'Savings Account',
        date: '2026-02-12',
        notes: 'Monthly savings',
    },
    {
        id: 10,
        description: 'Restaurant',
        amount: 67.8,
        type: 'expense',
        category: 'Food & Dining',
        accountId: 3,
        accountName: 'Credit Card',
        date: '2026-02-11',
    },
    {
        id: 11,
        description: 'Investment Dividend',
        amount: 150.25,
        type: 'income',
        category: 'Investment',
        accountId: 4,
        accountName: 'Investment Account',
        date: '2026-02-10',
    },
    {
        id: 12,
        description: 'Pharmacy',
        amount: 34.5,
        type: 'expense',
        category: 'Healthcare',
        accountId: 1,
        accountName: 'Chase Checking',
        date: '2026-02-09',
    },
    {
        id: 13,
        description: 'Rent Payment',
        amount: 1500.0,
        type: 'expense',
        category: 'Housing',
        accountId: 1,
        accountName: 'Chase Checking',
        date: '2026-02-01',
    },
    {
        id: 14,
        description: 'Car Insurance',
        amount: 225.0,
        type: 'expense',
        category: 'Insurance',
        accountId: 1,
        accountName: 'Chase Checking',
        date: '2026-01-28',
    },
    {
        id: 15,
        description: 'Gym Membership',
        amount: 45.0,
        type: 'expense',
        category: 'Personal Care',
        accountId: 1,
        accountName: 'Chase Checking',
        date: '2026-01-25',
    },
];

/**
 * Transactions for Dashboard (recent 5)
 */
export const mockRecentTransactions: Transaction[] = [
    {
        id: 1,
        description: 'Grocery Store',
        amount: -85.43,
        type: 'expense',
        category: 'Food & Dining',
        accountId: 1,
        accountName: 'Chase Checking',
        date: '2026-01-02',
    },
    {
        id: 2,
        description: 'Salary Deposit',
        amount: 3500.0,
        type: 'income',
        category: 'Income',
        accountId: 1,
        accountName: 'Chase Checking',
        date: '2026-01-01',
    },
    {
        id: 3,
        description: 'Netflix Subscription',
        amount: -15.99,
        type: 'expense',
        category: 'Entertainment',
        accountId: 3,
        accountName: 'Credit Card',
        date: '2025-12-30',
    },
    {
        id: 4,
        description: 'Gas Station',
        amount: -45.67,
        type: 'expense',
        category: 'Transportation',
        accountId: 1,
        accountName: 'Chase Checking',
        date: '2025-12-29',
    },
    {
        id: 5,
        description: 'Coffee Shop',
        amount: -12.5,
        type: 'expense',
        category: 'Food & Dining',
        accountId: 1,
        accountName: 'Chase Checking',
        date: '2025-12-28',
    },
];

/**
 * Simplified transaction interface for AccountDetails
 * (uses signed amounts: negative for expenses, positive for income)
 */
export interface SimpleTransaction {
    id: number;
    accountId: number;
    amount: number;
    description: string;
    date: string;
    type: 'income' | 'expense';
    category: string;
}

/**
 * Transactions for specific account (AccountDetails page)
 * These use signed amounts (negative for expenses)
 */
export const mockAccountTransactions: SimpleTransaction[] = [
    {
        id: 1,
        accountId: 1,
        amount: 2500.0,
        description: 'Salary Deposit',
        date: '2026-01-01',
        type: 'income',
        category: 'Salary',
    },
    {
        id: 2,
        accountId: 1,
        amount: -85.43,
        description: 'Grocery Store',
        date: '2025-12-28',
        type: 'expense',
        category: 'Food & Dining',
    },
    {
        id: 3,
        accountId: 1,
        amount: -45.67,
        description: 'Gas Station',
        date: '2025-12-27',
        type: 'expense',
        category: 'Transportation',
    },
    {
        id: 4,
        accountId: 1,
        amount: -1200.0,
        description: 'Rent Payment',
        date: '2025-12-01',
        type: 'expense',
        category: 'Housing',
    },
    {
        id: 5,
        accountId: 1,
        amount: -120.5,
        description: 'Electric Bill',
        date: '2025-12-05',
        type: 'expense',
        category: 'Bills & Utilities',
    },
    {
        id: 6,
        accountId: 1,
        amount: -67.8,
        description: 'Restaurant',
        date: '2025-12-10',
        type: 'expense',
        category: 'Food & Dining',
    },
    {
        id: 7,
        accountId: 1,
        amount: 500.0,
        description: 'Freelance Income',
        date: '2025-12-15',
        type: 'income',
        category: 'Business',
    },
];
