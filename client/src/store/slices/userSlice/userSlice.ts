import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserDTO, ErrorState } from '../../../types';
import { authService } from '../../../services';
import { getErrorData } from '../../../utils';

/**
 * User state shape.
 * <p>{@code initialized} is distinct from {@code isLoading}:
 * <ul>
 *     <li>{@code isLoading} - "are we currently fetching?"</li>
 *     <li>{@code initialized} - "have we ever attempted to fetch?"</li>
 * </ul>
 * Route guards read {@code initialized}, not {@code isLoading}, so a hard
 * refresh does not bounce an authenticated user to /login before the
 * bootstrap {@code /auth/me} call resolves.
 */
interface UserState {
    currentUser: UserDTO | null;
    isLoading: boolean;
    initialized: boolean;
    error: ErrorState;
}

const initialErrorState: ErrorState = {
    message: null,
    fieldErrors: null,
};
const initialState: UserState = {
    currentUser: null,
    isLoading: false,
    initialized: false,
    error: initialErrorState,
};

/**
 * Fetches the current authenticated user via {@code GET /auth/me}.
 * <p>The backend returns a {@code ResponseDTO<UserDTO>} envelope; this thunk
 * unwraps the inner {@link UserDTO} so consumers work with the profile directly.
 */
export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getCurrentUser();
            return response.data.data as UserDTO;
        } catch (error: unknown) {
            const { message, fieldErrors } = getErrorData(error);
            return rejectWithValue({
                message: message || 'Failed to fetch the current user.',
                fieldErrors,
            });
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = initialErrorState;
        },
        resetUserState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.isLoading = true;
                state.error = initialErrorState;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.isLoading = false;
                state.initialized = true;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.currentUser = null;
                state.isLoading = false;
                state.initialized = true;
                state.error = action.payload as ErrorState;
            });
    },
});

export const { clearUserError, resetUserState } = userSlice.actions;
export default userSlice.reducer;
