import { Header, Sidebar } from '../../components/layout';
import React, { type ReactNode, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';

const MainLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [headerActions, setHeaderActions] = useState<ReactNode>(null);
    const currentUser = useAppSelector((state) => state.user.currentUser);
    const location = useLocation();

    /**
     * Derives the page title from the current pathname.
     */
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        if (path === '/accounts') return 'Accounts';
        if (path.startsWith('/accounts/')) return 'Account Details';
        if (path === '/transactions') return 'Transactions';
        if (path === '/analytics') return 'Analytics';
        if (path === '/settings') return 'Settings';
        if (path === '/admin/users') return 'User Management';
        return 'Finance Tracker';
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar isOpen={sidebarOpen} />
            <div className="flex flex-col flex-1">
                <Header
                    title={getPageTitle()}
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    actions={headerActions}
                    userName={currentUser?.firstName || currentUser?.email || 'User'}
                />
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet context={{ setHeaderActions }} />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
