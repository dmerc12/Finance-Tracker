import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services';

/**
 * User interface.
 */
export interface User {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
}

/**
 * User state shape
 */
interface UserState {
    currentUser: User | null;
    users: User[];
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    currentUser: null,
    users: [],
    isLoading: false,
    error: null,
};

/**
 * Thunk to fetch the current authenticated user.
 */
export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getCurrentUser();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
        resetUserState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.currentUser = null;
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearUserError, resetUserState } = userSlice.actions;
export default userSlice.reducer;
