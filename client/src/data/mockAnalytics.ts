/**
 * Mock Analytics Data
 *
 * Central location for all mock analytics/chart data used throughout the application.
 * Update this file when building the API to easily swap mock data for real API calls.
 */

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

/**
 * Monthly trend data for Analytics page
 */
export const monthlyTrendData: MonthlyTrendData[] = [
    { month: 'Jul 2025', income: 4200, expenses: 2800, savings: 1400 },
    { month: 'Aug 2025', income: 4500, expenses: 3100, savings: 1400 },
    { month: 'Sep 2025', income: 4300, expenses: 2900, savings: 1400 },
    { month: 'Oct 2025', income: 4800, expenses: 3300, savings: 1500 },
    { month: 'Nov 2025', income: 4600, expenses: 3200, savings: 1400 },
    { month: 'Dec 2025', income: 5200, expenses: 3800, savings: 1400 },
    { month: 'Jan 2026', income: 4900, expenses: 3400, savings: 1500 },
    { month: 'Feb 2026', income: 5100, expenses: 3600, savings: 1500 },
];

/**
 * Category expense breakdown for Analytics and Dashboard
 */
export const categoryExpenseData: CategoryData[] = [
    { name: 'Food & Dining', value: 1250, color: '#FF6384' },
    { name: 'Transportation', value: 680, color: '#36A2EB' },
    { name: 'Entertainment', value: 420, color: '#FFCE56' },
    { name: 'Shopping', value: 890, color: '#4BC0C0' },
    { name: 'Bills & Utilities', value: 1450, color: '#9966FF' },
    { name: 'Healthcare', value: 320, color: '#FF9F40' },
    { name: 'Others', value: 290, color: '#C9CBCF' },
];

/**
 * Category income breakdown for Analytics
 */
export const categoryIncomeData: CategoryData[] = [
    { name: 'Salary', value: 3500, color: '#36A2EB' },
    { name: 'Freelance', value: 800, color: '#4BC0C0' },
    { name: 'Investments', value: 450, color: '#9966FF' },
    { name: 'Others', value: 350, color: '#C9CBCF' },
];

/**
 * Monthly comparison data for Analytics
 */
export const monthlyComparisonData: ComparisonData[] = [
    { category: 'Food & Dining', lastMonth: 1180, thisMonth: 1250 },
    { category: 'Transportation', lastMonth: 720, thisMonth: 680 },
    { category: 'Entertainment', lastMonth: 380, thisMonth: 420 },
    { category: 'Shopping', lastMonth: 950, thisMonth: 890 },
    { category: 'Bills', lastMonth: 1400, thisMonth: 1450 },
    { category: 'Healthcare', lastMonth: 290, thisMonth: 320 },
];

/**
 * Yearly comparison data for Analytics
 */
export const yearlyComparisonData: ComparisonData[] = [
    { category: 'Food & Dining', year2025: 13200, year2026: 2500 },
    { category: 'Transportation', year2025: 7800, year2026: 1360 },
    { category: 'Entertainment', year2025: 4900, year2026: 840 },
    { category: 'Shopping', year2025: 10400, year2026: 1780 },
    { category: 'Bills', year2025: 16800, year2026: 2900 },
    { category: 'Healthcare', year2025: 3600, year2026: 640 },
];

/**
 * Spending data for Dashboard pie chart
 */
export const mockSpendingData: CategoryData[] = [
    { name: 'Food & Dining', value: 450, color: '#FF6384' },
    { name: 'Transportation', value: 230, color: '#36A2EB' },
    { name: 'Entertainment', value: 180, color: '#FFCE56' },
    { name: 'Shopping', value: 320, color: '#4BC0C0' },
    { name: 'Bills & Utilities', value: 550, color: '#9966FF' },
    { name: 'Healthcare', value: 120, color: '#FF9F40' },
];

/**
 * Balance history for AccountDetails page
 */
export const mockBalanceHistory: BalanceHistoryData[] = [
    { date: 'Dec 1', balance: 3800 },
    { date: 'Dec 8', balance: 4100 },
    { date: 'Dec 15', balance: 3900 },
    { date: 'Dec 22', balance: 4300 },
    { date: 'Dec 29', balance: 4000 },
    { date: 'Jan 5', balance: 4200 },
];

/**
 * Monthly activity for AccountDetails page
 */
export const mockMonthlyActivity: MonthlyActivityData[] = [
    { month: 'Aug', income: 2800, expenses: 2200 },
    { month: 'Sep', income: 3000, expenses: 2400 },
    { month: 'Oct', income: 2900, expenses: 2300 },
    { month: 'Nov', income: 3100, expenses: 2600 },
    { month: 'Dec', income: 3200, expenses: 2500 },
    { month: 'Jan', income: 2500, expenses: 2100 },
];

/**
 * Example data for generic components showcase
 */
export const salesData = [
    { month: 'Jan', sales: 4200, revenue: 8400 },
    { month: 'Feb', sales: 3800, revenue: 7600 },
    { month: 'Mar', sales: 5100, revenue: 10200 },
    { month: 'Apr', sales: 4600, revenue: 9200 },
    { month: 'May', sales: 5400, revenue: 10800 },
    { month: 'Jun', sales: 6200, revenue: 12400 },
];
