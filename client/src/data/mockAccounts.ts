import { type Account } from '../types';

/**
 * Mock Account Data
 *
 * Central location for all mock account data used throughout the application.
 * Update this file when building the API to easily swap mock data for real API calls.
 */

export const mockAccounts: Account[] = [
    {
        id: 1,
        name: 'Chase Checking',
        type: 'Checking',
        balance: 4234.56,
        institution: 'Chase Bank',
        accountNumber: '****1234',
        lastUpdated: '2026-01-03',
        archived: false,
        icon: 'wallet',
    },
    {
        id: 2,
        name: 'Savings Account',
        type: 'Savings',
        balance: 8309.33,
        institution: 'Bank of America',
        accountNumber: '****5678',
        lastUpdated: '2026-01-03',
        archived: false,
        icon: 'piggybank',
    },
    {
        id: 3,
        name: 'Credit Card',
        type: 'Credit',
        balance: -1250.0,
        institution: 'American Express',
        accountNumber: '****9012',
        lastUpdated: '2026-01-02',
        archived: false,
        icon: 'creditcard',
    },
    {
        id: 4,
        name: 'Investment Account',
        type: 'Investment',
        balance: 15234.89,
        institution: 'Fidelity',
        accountNumber: '****3456',
        lastUpdated: '2026-01-01',
        archived: false,
        icon: 'trending',
    },
    {
        id: 5,
        name: 'Old Checking Account',
        type: 'Checking',
        balance: 0.0,
        institution: 'Wells Fargo',
        accountNumber: '****7890',
        lastUpdated: '2025-12-15',
        archived: true,
    },
    {
        id: 6,
        name: 'Closed Credit Card',
        type: 'Credit',
        balance: 0.0,
        institution: 'Capital One',
        accountNumber: '****4567',
        lastUpdated: '2025-11-30',
        archived: true,
    },
    {
        id: 7,
        name: 'Emergency Fund',
        type: 'Savings',
        balance: 0.0,
        institution: 'Ally Bank',
        accountNumber: '****2468',
        lastUpdated: '2026-01-10',
        archived: false,
    },
];

/**
 * Simple account data for dropdowns and selections
 * (without full details)
 */
export const mockAccountsSimple = [
    { id: 1, name: 'Chase Checking', type: 'Checking', balance: 4234.56 },
    { id: 2, name: 'Savings Account', type: 'Savings', balance: 8309.33 },
    { id: 3, name: 'Credit Card', type: 'Credit', balance: -1250.0 },
    { id: 4, name: 'Investment Account', type: 'Investment', balance: 15234.67 },
];
