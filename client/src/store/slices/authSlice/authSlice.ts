import type { RegisterRequest, LoginRequest, ErrorState } from '../../../types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../../services';
import { getErrorData } from '../../../utils';

/**
 * Authentication state shape.
 */
interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: ErrorState;
}

const initialErrorState: ErrorState = {
    message: null,
    fieldErrors: null,
};

const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: false,
    error: initialErrorState,
};

/**
 * Thunk to log in a user.
 * <p>The backend sets the HTTP-only cookie on success.
 */
export const login = createAsyncThunk(
    'auth/login',
    async (data: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await authService.login(data);
            return response.data.data;
        } catch (error: unknown) {
            const { message, fieldErrors } = getErrorData(error);
            return rejectWithValue({
                message: message || 'Login failed',
                fieldErrors,
            });
        }
    }
);

/**
 * Thunk to log out a user.
 * <p>The backend clears the HTTP-only cookie.
 */
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await authService.logout();
        return { success: true };
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
});

/**
 * Thunk to register a new user.
 * <p>After successful registration, the user may be automatically logged in.
 */
export const register = createAsyncThunk(
    'auth/register',
    async (data: RegisterRequest, { rejectWithValue }) => {
        try {
            const response = await authService.register(data);
            return response.data.data;
        } catch (error: unknown) {
            const { message, fieldErrors } = getErrorData(error);
            return rejectWithValue({
                message: message || 'Registration failed',
                fieldErrors,
            });
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuthError: (state) => {
            state.error = initialState.error;
        },
        resetAuthState: () => initialState,
    },
    extraReducers: (builder) => {
        // -- login --
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = initialErrorState;
            })
            .addCase(login.fulfilled, (state) => {
                state.isAuthenticated = true;
                state.isLoading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = action.payload as ErrorState;
            });
        // -- logout --
        builder
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logout.fulfilled, () => initialState)
            .addCase(logout.rejected, () => initialState);
        // -- register --
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = initialErrorState;
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
                // Do NOT auto-authenticate - user should log in separately
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as ErrorState;
            });
    },
});

export const { clearAuthError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
