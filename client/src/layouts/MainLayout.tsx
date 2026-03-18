import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
    return (
        <div>
            <header style={{ background: '#f0f0f0', padding: '1rem' }}>
                <h2>Finance Tracker</h2>
                <nav>
                    <a href="/">Dashboard</a> |{' '}
                    <a href="/accounts">Accounts</a> |{' '}
                    <a href="/transactions">Transactions</a> |{' '}
                    <a href="/settings">Settings</a> |{' '}
                </nav>
            </header>
            <main style={{ padding: '1rem' }}>
                <Outlet />
            </main>
            <footer style={{ background: '#f0f0f0', padding: '1rem', marginTop: '2rem' }}>
                <p>&copy; {new Date().getFullYear()} Finance Tracker</p>
            </footer>
        </div>
    );
};

export default MainLayout;
