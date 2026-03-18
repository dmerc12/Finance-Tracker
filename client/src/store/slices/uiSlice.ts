import { createSlice } from '@reduxjs/toolkit';

interface UIState {
    // TODO: define UI state (loading, theme, etc.) later
}

const initialState: UIState = {};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {},
});

export default uiSlice.reducer;
