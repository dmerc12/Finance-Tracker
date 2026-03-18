import { createSlice } from '@reduxjs/toolkit';

interface AccountState {
    // TODO: define accounts state shape later
}

const initialState: AccountState = {};

const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {},
});

export default accountsSlice.reducer;
