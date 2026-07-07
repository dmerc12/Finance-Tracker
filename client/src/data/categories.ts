/**
 * Category Definitions
 *
 * Central location for all category definitions used throughout the application.
 * Update this file to add, remove, or modify transaction categories.
 */

/**
 * Income categories
 */
export const incomeCategories = ['Salary', 'Business', 'Investment', 'Freelance', 'Other Income'];

/**
 * Expense categories
 */
export const expenseCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Housing',
    'Insurance',
    'Education',
    'Personal Care',
    'Travel',
    'Other Expense',
];

/**
 * Transfer category
 */
export const transferCategory = ['Transfer'];

/**
 * All categories combined
 */
export const allCategories = [...incomeCategories, ...expenseCategories, ...transferCategory];

/**
 * Get categories for a specific transaction type
 */
export function getCategoriesForType(type: 'income' | 'expense' | 'transfer'): string[] {
    switch (type) {
        case 'income':
            return incomeCategories;
        case 'expense':
            return expenseCategories;
        case 'transfer':
            return transferCategory;
        default:
            return [];
    }
}
