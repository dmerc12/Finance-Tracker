import { useState } from 'react';

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    userId: string;
    joinedDate: string;
}

interface SettingsState {
    currency: string;
    dateFormat: string;
    language: string;
}

export default function useSettings() {
    // Profile state
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: 'John',
        lastName: 'Doe',
        email: 'demo@financetracker.com',
        userId: 'USR-2024-001',
        joinedDate: 'January 15, 2024',
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);
    // Preferences state
    const [preferences, setPreferences] = useState<SettingsState>({
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        language: 'English',
    });
    const [isSavingPreferences, setIsSavingPreferences] = useState(false);
    const [preferencesSuccess, setPreferencesSuccess] = useState(false);
    // Security state
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    // Data state
    const [showClearDataModal, setShowClearDataModal] = useState(false);
    const [showDeleteProfileModal, setShowDeleteProfileModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleSaveProfile = (data: { firstName: string; lastName: string; email: string }) => {
        setIsSavingProfile(true);
        setProfileSuccess(false);
        setTimeout(() => {
            setProfileData({
                ...profileData,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
            });
            setIsSavingProfile(false);
            setProfileSuccess(true);
            setIsEditingProfile(false);
            setTimeout(() => setProfileSuccess(false), 3000);
        }, 1000);
    };

    const handleSavePreferences = () => {
        setIsSavingPreferences(true);
        setPreferencesSuccess(false);
        setTimeout(() => {
            setIsSavingPreferences(false);
            setPreferencesSuccess(true);
            setTimeout(() => setPreferencesSuccess(false), 3000);
        }, 1000);
    };

    const handleChangePassword = () => {
        setIsSavingPassword(true);
        setPasswordSuccess(false);
        setTimeout(() => {
            setIsSavingPassword(false);
            setPasswordSuccess(true);
            setTimeout(() => setPasswordSuccess(false), 3000);
        }, 1000);
    };

    const handleExportTransactions = () => {
        setIsExporting(true);
        setTimeout(() => {
            // Sample CSV content (keep your actual content here)
            const csvContent =
                '=== ACCOUNTS ===\n' +
                'Account Name,Account Type,Balance,Status,Created Date\n' +
                'Main Checking,Checking,5420.50,Active,2024-01-15\n' +
                'Savings Account,Savings,12500.00,Active,2024-01-15\n' +
                'Emergency Fund,Savings,8000.00,Active,2024-02-01\n' +
                'Credit Card,Credit Card,-450.75,Active,2024-01-20\n\n' +
                '=== TRANSACTIONS ===\n' +
                'Date,Description,Category,Amount,Type,Account\n' +
                '2024-02-20,Coffee Shop,Food & Dining,-4.50,Expense,Main Checking\n' +
                '2024-02-19,Salary Deposit,Income,3500.00,Income,Main Checking\n' +
                '2024-02-18,Grocery Store,Groceries,-85.20,Expense,Credit Card\n' +
                '2024-02-17,Transfer to Savings,Transfer,-500.00,Transfer,Main Checking\n' +
                '2024-02-17,Transfer from Checking,Transfer,500.00,Transfer,Emergency Fund\n';
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `financetracker-export-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            setIsExporting(false);
        }, 1000);
    };

    const handleClearData = () => {
        setTimeout(() => {
            setShowClearDataModal(false);
            alert('All data (accounts and transactions) has been cleared successfully.');
        }, 500);
    };

    const handleDeleteProfile = () => {
        setTimeout(() => {
            setShowDeleteProfileModal(false);
            alert('Account deleted successfully. Redirecting to login page...');
        }, 500);
    };
    return {
        // Profile
        isEditingProfile,
        setIsEditingProfile,
        profileData,
        isSavingProfile,
        profileSuccess,
        setProfileSuccess,
        handleSaveProfile,
        // Preferences
        preferences,
        setPreferences,
        isSavingPreferences,
        preferencesSuccess,
        setPreferencesSuccess,
        handleSavePreferences,
        // Security
        isSavingPassword,
        passwordSuccess,
        setPasswordSuccess,
        handleChangePassword,
        // Data
        showClearDataModal,
        setShowClearDataModal,
        showDeleteProfileModal,
        setShowDeleteProfileModal,
        isExporting,
        handleExportTransactions,
        handleClearData,
        handleDeleteProfile,
    };
}
