import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-light text-center py-3 mt-auto">
            <div className="container">
                <span>&copy; {new Date().getFullYear()} Finance Tracker. All rights reserved.</span>
            </div>
        </footer>
    );
};

export default Footer;
