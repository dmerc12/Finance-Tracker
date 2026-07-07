export interface Account {
    id: number;
    name: string;
    type: 'Checking' | 'Savings' | 'Credit' | 'Investment';
    balance: number;
    institution?: string;
    accountNumber?: string;
    lastUpdated: string;
    archived?: boolean;
    icon?: string;
}
