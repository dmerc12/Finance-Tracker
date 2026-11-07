import { useEffect, useRef, type ReactNode } from 'react';
import { subscribeToAuthEvents } from '../../utils';
import { ensureCsrfCookie } from '../../services';
import {
    fetchCurrentUser,
    useAppDispatch,
    useAppSelector,
    resetAuthState,
    clearCurrentUser,
} from '../../store';

interface SessionBootstrapProps {
    children: ReactNode;
}

/**
 * Bootstraps the session on app load.
 * <p>On mount, fires three independent concerns:
 * <ul>
 *     <li>
 *         {@code fetchCurrentUser()} - populates the user slice from {@code GET /api/auth/me},
 *         so the route guard knows whether the visitor has a valid session
 *     </li>
 *     <li>
 *         {@code ensureCsrfCookie()} - establishes the {@code XSRF-TOKEN} cookie
 *         required by every subsequent state-changing request.
 *         Fires regardless of auth state because the cookie is a session cookie:
 *         it dies with the tab, and must exist before the first POST
 *         (login, register, or any future mutation)
 *     </li>
 *     <li>
 *         Cross-tab auth events - when another tab broadcasts a {@code logout},
 *         this tab clears its local session so the route guard can redirect
 *     </li>
 * </ul>
 * <p>None of the above work blocks the initial render; children mount immediately.
 * The CSRF primer is fire-and-forget with error logging - if it fails,
 * the first mutating request returns 403 and the user retries.
 * A retry-on-403 flow in the axios interceptor is deliberately not implemented;
 * the failure window is small (sub-second in normal network conditions)
 * and adds complexity for marginal gain on a portfolio-scale deployment.
 */
export default function SessionBootstrap({ children }: SessionBootstrapProps) {
    const dispatch = useAppDispatch();
    const initialized = useAppSelector((state) => state.user.initialized);
    const hasFetchedUserRef = useRef(false);
    const hasPrimedCsrfRef = useRef(false);

    // Prime the CSRF cookie on every app load, independent of auth state.
    // The XSRF-TOKEN cookie is a session cookie, so it dies with the tab;
    // The first POST after a reload would 403 without this primer.
    // The memoized promise in ensureCsrfCookie() means a StrictMode double-mount
    // triggers one network call, not two.
    useEffect(() => {
        if (!hasPrimedCsrfRef.current) {
            hasPrimedCsrfRef.current = true;
            ensureCsrfCookie().catch((err) => {
                // Non-fatal: the user will see a 403 on the first mutation and can retry.
                // Logged so operators can correlate.
                console.error('Failed to establish CSRF cookie', err);
            });
        }
    }, []);

    useEffect(() => {
        if (!hasFetchedUserRef.current && !initialized) {
            hasFetchedUserRef.current = true;
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, initialized]);

    // Cross-tab logout: another tab broadcast the event, so this tab clears its local session.
    // The route guard sees isAuthenticated flip to false and redirects to /login.
    // clearCurrentUser preserves `initialized` to avoid a refetch loop.
    useEffect(() => {
        return subscribeToAuthEvents((event) => {
            if (event.type === 'logout') {
                dispatch(resetAuthState());
                dispatch(clearCurrentUser());
            }
        });
    }, [dispatch]);

    return <>{children}</>;
}
