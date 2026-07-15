import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services';

/**
 * Authentication state shape.
 */
interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

/**
 * Thunk to log in a user.
 * <p>The backend sets the HTTP-only cookie on success.
 */
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await authService.login(email, password);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
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
    async (
        data: { email: string; password: string; firstName?: string; lastName?: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await authService.register(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuthError: (state) => {
            state.error = null;
        },
        resetAuthState: () => initialState,
    },
    extraReducers: (builder) => {
        // -- login --
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state) => {
                state.isAuthenticated = true;
                state.isLoading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = action.payload as string;
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
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
                // Do NOT auto-authenticate - user should log in separately
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearAuthError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
