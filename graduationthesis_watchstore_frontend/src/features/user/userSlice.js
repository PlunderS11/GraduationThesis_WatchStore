import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: {},
    isLogin: false,
    error: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: {
            reducer(state, action) {
                const { username, role, phone, sex, address, email } = action.payload;
                state.user.username = username;
                state.user.email = email;
                state.user.role = role;
                state.user.phone = phone;
                state.user.sex = sex;
                state.user.address = address;
                state.isLogin = true;
            },
            prepare(user) {
                return {
                    payload: {
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                        sex: user.sex,
                        address: user.address,
                        role: user.role,
                    },
                };
            },
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

export const { setCurrentUser, logOut } = userSlice.actions;

export default userSlice.reducer;
