import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from '../loading-screen';
import React, { type ReactNode } from 'react';
import { useAppSelector } from '../../store';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: string[];
    redirectTo?: string;
}

/**
 * Route wrapper that enforces authentication and, optionally, role membership.
 *
 * <p>Rendering rules:
 * <ul>
 *     <li>While {@code user.initialized} is false → {@link LoadingScreen}.</li>
 *     <li>
 *         When initialized and unauthenticated → redirect to {@code redirectTo},
 *         storing the current path in {@code location.state.from}.
 *     </li>
 *     <li>When authenticated but missing a required role → redirect to {@code /unauthorized}.</li>
 *     <li>Otherwise → render {@code children}.</li>
 * </ul>
 *
 * <p>{@code isAuthenticated} is the source of truth for "session is live".
 * It is set by both the login thunk and the {@code /auth/me} bootstrap
 * (see {@code authSlice.extraReducers}), so a hard refresh with a valid
 * refresh cookie restores it correctly.
 *
 * <p>Role checks additionally require {@code user} to be populated.
 * Once {@code isAuthenticated} is true, {@code currentUser} is guaranteed to be
 * present - the auth flag is only set by a successful identity resolution.
 */
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

    if (requiredRoles.length > 0 && user) {
        const hasRequiredRole = requiredRoles.some((role) => user.roles?.includes(role));
        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
