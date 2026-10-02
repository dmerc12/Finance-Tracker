import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from '../loading-screen';
import React, { type ReactNode } from 'react';
import { useAppSelector } from '../../store';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: string[];
    redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRoles = [],
    redirectTo = '/login',
}) => {
    const location = useLocation();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const { currentUser: user, initialized } = useAppSelector((state) => state.user);

    if (!initialized) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated || !user) {
        return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
    }

    if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some((role) => user.roles?.includes(role));
        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
