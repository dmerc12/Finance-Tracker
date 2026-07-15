import { EmptyState } from '../common';
import { Wallet } from 'lucide-react';

export default function DashboardEmptyState() {
    return (
        <div className="h-screen bg-slate-50 flex items-center justify-center">
            <EmptyState
                icon={Wallet}
                title="Welcome to Finance-Tracker!"
                description="You haven't added any accounts or transactions yet. Get started by connecting your first account to track your finances."
                actions={[
                    {
                        label: 'Add Your First Account',
                        onClick: () => (window.location.href = '/add-account'),
                    },
                    {
                        label: 'Import Transactions',
                        onClick: () => (window.location.href = '/import'),
                        variant: 'outline',
                    },
                ]}
            />
        </div>
    );
}
