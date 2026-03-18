import { createSlice } from '@reduxjs/toolkit';

interface TransactionsState {
    // TODO: define transactions state shape later
}

const initialState: TransactionsState = {};

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {},
});

export default transactionsSlice.reducer;
