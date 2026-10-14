import type { RegisterRequest, LoginRequest, ErrorState } from '../../../types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCurrentUser } from '../userSlice';
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
 * <p>The backend blacklists the current access and refresh tokens and clears the auth cookies.
 * The frontend clears its own state regardless of whether this call succeeds -
 * see {@code extraReducers} below.
 */
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await authService.logout();
        return { success: true };
    } catch (error: unknown) {
        const { message } = getErrorData(error);
        return rejectWithValue({
            message: message || 'Logout failed',
            fieldErrors: {},
        });
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
        // Both success and failure reset the slice.
        // The frontend cannot clear HttpOnly cookies;
        // if the API call fails, local state is cleared anyway and the cookies expire naturally.
        // From the user's perspective, the click on "Logout" always logs them out.
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
        builder
            .addCase(fetchCurrentUser.fulfilled, (state) => {
                state.isAuthenticated = true;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.isAuthenticated = false;
            });
    },
});

export const { clearAuthError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
