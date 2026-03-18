import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-card border-t border-border py-4 text-center text-sm text-muted-foreground">
            <div className="container">
                <span>&copy; {new Date().getFullYear()} Finance Tracker. All rights reserved.</span>
            </div>
        </footer>
    );
};

export default Footer;
