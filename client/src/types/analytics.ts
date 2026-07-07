export interface MonthlyTrendData {
    month: string;
    income: number;
    expenses: number;
    savings: number;
}

export interface CategoryData {
    name: string;
    value: number;
    color: string;
}

export interface ComparisonData {
    category: string;
    lastMonth?: number;
    thisMonth?: number;
    year2025?: number;
    year2026?: number;
}

export interface BalanceHistoryData {
    date: string;
    balance: number;
}

export interface MonthlyActivityData {
    month: string;
    income: number;
    expenses: number;
}
