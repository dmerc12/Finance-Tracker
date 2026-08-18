import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice/authSlice.ts';
import userReducer from './slices/userSlice';
import accountsReducer from './slices/accountsSlice';
import transactionsReducer from './slices/transactionsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        accounts: accountsReducer,
        transactions: transactionsReducer,
        ui: uiReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { useAppDispatch, useAppSelector } from './hooks';
export {
    // User slice
    fetchCurrentUser,
    clearUserError,
    resetUserState,
    // Auth slice
    login,
    logout,
    register,
    clearAuthError,
    resetAuthState,
} from './slices';
