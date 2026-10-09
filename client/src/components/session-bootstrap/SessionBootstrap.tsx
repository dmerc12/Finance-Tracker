import { fetchCurrentUser, useAppDispatch, useAppSelector } from '../../store';
import { useEffect, useRef, type ReactNode } from 'react';

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

    return <>{children}</>;
}
