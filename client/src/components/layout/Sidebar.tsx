import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <div className="p--4">
            <h5 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Navigation
            </h5>
            <nav>
                <ul className="space-y-2">
                    <li>
                        <a
                            className="block px-3 py-2 rounded-md text-foreground hover:bg-accend hover:text-accent-foreground"
                            href="/"
                        >
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a
                            className="block px-3 py-2 rounded-md text-foreground hover:bg-accend hover:text-accent-foreground"
                            href="/accounts"
                        >
                            Accounts
                        </a>
                    </li>
                    <li>
                        <a
                            className="block px-3 py-2 rounded-md text-foreground hover:bg-accend hover:text-accent-foreground"
                            href="/transactions"
                        >
                            Transactions
                        </a>
                    </li>
                    <li>
                        <a
                            className="block px-3 py-2 rounded-md text-foreground hover:bg-accend hover:text-accent-foreground"
                            href="/settings"
                        >
                            Settings
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
