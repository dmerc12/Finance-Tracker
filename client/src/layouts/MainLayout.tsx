import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer, Sidebar } from '../components/layout';

const MainLayout: React.FC = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="container-fluid flex-grow-1">
                <div className="row h-100">
                    <div className="col-md-3 col-lg-2 p-0">
                        <Sidebar />
                    </div>
                    <main className="col-md-9 col-lg-10 p-4">
                        <Outlet />
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;
