import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer, Sidebar } from '../components/layout';

const MainLayout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <div className="flex flex-1">
                <aside className="w-64 border-r border-border bg-card">
                    <Sidebar />
                </aside>
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;
