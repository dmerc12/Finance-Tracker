import React from 'react';

const Header: React.FC = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
            <a className="navbar-brand" href="/">
                Finance Tracker
            </a>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/">
                            Dashboard
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/accounts">
                            Accounts
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/transactions">
                            Transactions
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/settings">
                            Settings
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
