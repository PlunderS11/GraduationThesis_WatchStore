import { createSlice } from '@reduxjs/toolkit';
import { fetchUserInfor } from './useThunk';

const initialState = {
    user: {},
    token: localStorage.getItem('mynhbake_token') ? localStorage.getItem('mynhbake_token') : '',
    isLogin: false,
    isLoadingUser: false,
    error: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setTokenUser: (state, action) => {
            state.token = action.payload;
            state.isLogin = true;
        },
        logOut: {
            reducer(state, action) {
                state.user = {};
                state.isLogin = false;
                state.error = '';
            },
            prepare() {
                localStorage.removeItem('mynhbake_token');
                return {
                    payload: {},
                };
            },
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUserInfor.pending, (state, action) => {
                state.isLoadingUser = true;
                state.isLogin = true;
            })
            .addCase(fetchUserInfor.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLogin = true;
                state.isLoadingUser = false;
            })
            .addCase(fetchUserInfor.rejected, (state, action) => {
                state.isLoadingUser = false;
                state.isLogin = false;
            });
    },
});

export const { setTokenUser, logOut } = userSlice.actions;

export default userSlice.reducer;
