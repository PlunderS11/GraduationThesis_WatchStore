import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: {},
    token: localStorage.getItem('mynhbake_token') ? localStorage.getItem('mynhbake_token') : '',
    isLogin: false,
    error: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setTokenUser: (state, action) => {
            state.token = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.user = action.payload;
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
});

export const { setTokenUser, setCurrentUser, logOut } = userSlice.actions;

export default userSlice.reducer;
