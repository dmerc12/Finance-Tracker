import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <aside className="bg-light p-3 h-100">
            <h5>Navigation</h5>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <a className="nav-link" href="/">Dashboard</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/accounts">Accounts</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/transactions">Transactions</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/settings">Settings</a>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
