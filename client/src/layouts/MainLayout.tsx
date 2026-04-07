import React, { type ReactNode, useState } from 'react';
import { Header, Sidebar } from '../components/layout';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [headerActions, setHeaderActions] = useState<ReactNode>(null);
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Dashboard';
        if (path === '/accounts') return 'Accounts';
        if (path === '/transactions') return 'Transactions';
        if (path === '/analytics') return 'Analytics';
        if (path === '/settings') return 'Settings';
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
                    userName="User" // TODO: replace with actual user name from auth
                />
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet context={{ setHeaderActions }} />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
