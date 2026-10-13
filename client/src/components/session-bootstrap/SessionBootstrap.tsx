import { useEffect, useRef, type ReactNode } from 'react';
import { subscribeToAuthEvents } from '../../utils';
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

export default function SessionBootstrap({ children }: SessionBootstrapProps) {
    const dispatch = useAppDispatch();
    const initialized = useAppSelector((state) => state.user.initialized);
    const hasFiredRef = useRef(false);

    useEffect(() => {
        if (!hasFiredRef.current && !initialized) {
            hasFiredRef.current = true;
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
