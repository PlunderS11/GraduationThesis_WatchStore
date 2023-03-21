import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosClient from '../../api/axiosClient';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const response = await axiosClient.get('product/home');
    return response.data.product;
});
