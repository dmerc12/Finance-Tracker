import { SessionBootstrap, ProtectedRoute, ErrorBoundary } from './components';
import { Unauthorized, Login, Register, UserManagement } from './pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AccountDetails from './pages/AccountDetails';
import Transactions from './pages/Transactions';
import { useLocation } from 'react-router-dom';
import { Toaster } from './components/ui';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Accounts from './pages/Accounts';
import { MainLayout } from './layouts';

/**
 * The routed content, wrapped in an error boundary that resets whenever the location changes.
 * Extracted into its own component because {@code useLocation} is a hook and cannot be
 * called from {@code App} (which renders the Router).
 * When a page throws, the fallback renders; clicking any {@code Link} -
 * including the one in the fallback -
 * changes {@code location.key} and clears the error.
 */
function AppRoutes() {
    const location = useLocation();
    return (
        <ErrorBoundary resetKey={location.key}>
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
                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                                <UserManagement />
                            </ProtectedRoute>
                        }
                    />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </ErrorBoundary>
    );
}

function App() {
    return (
        <>
            <BrowserRouter>
                <SessionBootstrap>
                    <AppRoutes />
                </SessionBootstrap>
            </BrowserRouter>
            <Toaster />
        </>
    );
}

export default App;
