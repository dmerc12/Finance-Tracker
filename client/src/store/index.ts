import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import accountsReducer from './slices/accountsSlice';
import transactionsReducer from './slices/transactionsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        accounts: accountsReducer,
        transactions: transactionsReducer,
        ui: uiReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
