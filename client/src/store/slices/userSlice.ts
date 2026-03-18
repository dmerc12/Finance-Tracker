import { createSlice } from '@reduxjs/toolkit';

interface UserState {
    // TODO: define user state shape later
}

const initialState: UserState = {};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
});

export default userSlice.reducer;
