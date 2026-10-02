import { SessionBootstrap, ProtectedRoute } from './components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Unauthorized, Login, Register } from './pages';
import AccountDetails from './pages/AccountDetails';
import Transactions from './pages/Transactions';
import MainLayout from './layouts/MainLayout';
import { Toaster } from './components/ui';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Accounts from './pages/Accounts';

function App() {
    return (
        <>
            <BrowserRouter>
                <SessionBootstrap>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <MainLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<Dashboard />} />
                            <Route path="/accounts" element={<Accounts />} />
                            <Route path="/accounts/:id" element={<AccountDetails />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/settings" element={<Settings />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </SessionBootstrap>
            </BrowserRouter>
            <Toaster />
        </>
    );
}

export default App;
