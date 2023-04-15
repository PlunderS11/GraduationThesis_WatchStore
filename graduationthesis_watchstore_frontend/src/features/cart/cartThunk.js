import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

export const fetchEstimate = createAsyncThunk('cart/fetchEstimate', async (data, thunkApi) => {
    try {
        // eslint-disable-next-line no-unused-vars
        const { rejectWithValue, getState } = thunkApi;
        const products = getState().cart.items;

        const resUser = await axiosClient.get('user/userInfo');
        var promotionCode = '';
        if (data) {
            const resPromotion = await axiosClient.get('promotion');
            const resOrder = await axiosClient.get('order/customer');
            const promotionExist = resOrder.data.orders.find(item => item.promotion?.code === data);
            const promotion = resPromotion.data.promotions.find(p => p.code === data);
            if (promotion?.isDelete || !promotion) {
                toast.info('Khuyến mãi không tồn tại');
            } else if (new Date().getTime() < new Date(promotion?.startDate).getTime()) {
                toast.info('Khuyến mãi chưa bắt đầu');
            } else if (new Date().getTime() > new Date(promotion?.endDate).getTime()) {
                toast.info('Khuyến mãi đã hết');
            } else if (promotionExist) {
                toast.info('Khuyến mãi đã được sử dụng');
            } else {
                toast.success('Áp dụng mã khuyến mãi thành công!');
                promotionCode = data;
            }
        }
        const res = await axiosClient.post('order/estimate', {
            province: resUser.data.address.province,
            district: resUser.data.address.district,
            ward: resUser.data.address.ward,
            promotionCode: promotionCode,
            products: products.reduce((acc, cur) => {
                acc.push({
                    productId: cur.product._id,
                    quantity: cur.quantity,
                });
                return acc;
            }, []),
        });
        return res.data;
    } catch (error) {
        toast.error(error.message);
    }
});
