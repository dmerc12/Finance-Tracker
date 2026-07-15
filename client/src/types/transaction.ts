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
