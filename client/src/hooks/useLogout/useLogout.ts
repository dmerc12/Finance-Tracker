import { type AppDispatch, logout, clearCurrentUser } from '../../store';
import { useNavigate } from 'react-router-dom';
import { broadcastLogout } from '../../utils';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

/**
 * Handles the logout flow:
 * dispatch the API thunk, clear local user state, broadcast to other tabs, and navigate to /login.
 *
 * <p>Local state is cleared regardless of whether the API call succeeds.
 * The user asked to log out;
 * the frontend should not keep them in a logged-in shell because the network hiccuped.
 * The cookies will expire naturally if the API was unreachable, so the session cannot be
 * resurrected without a fresh login.
 */
export default function useLogout() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        // The thunk resets authSlice on both fulfilled and rejected,
        // so we do not need to inspect the result here.
        await dispatch(logout());
        // userSlice is not reset by the logout thunk.
        // clearCurrentUser keeps `initialized: true`, which prevents SessionBootstrap from refiring
        // /auth/me in a loop after we land on /login.
        dispatch(clearCurrentUser());
        broadcastLogout();
        navigate('/login', { replace: true });
    }, [dispatch, navigate]);

    return { handleLogout };
}
