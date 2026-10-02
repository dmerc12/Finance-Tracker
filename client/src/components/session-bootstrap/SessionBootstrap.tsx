import { fetchCurrentUser, useAppDispatch, useAppSelector } from '../../store';
import { useEffect, type ReactNode } from 'react';

interface SessionBootstrapProps {
    children: ReactNode;
}

export default function SessionBootstrap({ children }: SessionBootstrapProps) {
    const dispatch = useAppDispatch();
    const initialized = useAppSelector((state) => state.user.initialized);

    useEffect(() => {
        if (!initialized) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, initialized]);

    return <>{children}</>;
}
