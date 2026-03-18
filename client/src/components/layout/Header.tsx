import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
            <a className="text-xl font-medium text-primary" href="/">
                Finance Tracker
            </a>
            <button className="md:hidden text-muted-foreground">
                <span className="sr-only">Open menu</span>☰
            </button>
            <nav className="hidden md:block">
                <ul className="flex space-x-6">
                    <li>
                        <a className="text-foreground hover:text-primary" href="/">
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a className="text-foreground hover:text-primary" href="/accounts">
                            Accounts
                        </a>
                    </li>
                    <li>
                        <a className="text-foreground hover:text-primary" href="/transactions">
                            Transactions
                        </a>
                    </li>
                    <li>
                        <a className="text-foreground hover:text-primary" href="/settings">
                            Settings
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
