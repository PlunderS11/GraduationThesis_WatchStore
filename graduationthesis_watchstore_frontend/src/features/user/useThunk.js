import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosClient from '../../api/axiosClient';

export const fetchUserInfor = createAsyncThunk('user/fetchUserInfor', async () => {
    const res = await axiosClient.get('user/userInfo');
    return res.data;
});
