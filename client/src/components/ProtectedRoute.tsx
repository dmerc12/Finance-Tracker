import { useAppDispatch, useAppSelector, fetchCurrentUser } from '../store';
import React, { type ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles: string[];
    redirectTo: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRoles = [],
    redirectTo = '/login',
}) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const { currentUser: user, isLoading } = useAppSelector((state) => state.user);

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, isAuthenticated, isLoading]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated || !user) {
        return <Navigate to={redirectTo} replace />;
    }

    if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some((role) => user.roles?.includes(role));
        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
};
