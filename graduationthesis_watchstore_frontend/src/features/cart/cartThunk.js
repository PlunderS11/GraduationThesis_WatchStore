import { createAsyncThunk } from '@reduxjs/toolkit';
import i18n from 'i18next';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

export const fetchEstimate = createAsyncThunk('cart/fetchEstimate', async (data, thunkApi) => {
    try {
        // eslint-disable-next-line no-unused-vars
        const { rejectWithValue, getState } = thunkApi;
        const products = getState().cart.items;
        const resUser = await axiosClient.get('user/userInfo');
        var promotionCode = '';
        var code = data || getState().cart.promotionCode;
        if (code) {
            const resPromotion = await axiosClient.get('promotion/myPromotion');
            const promotionAvailable = resPromotion?.data.promotionAvailable?.find(p => p.code === code);
            const promotionExist = !!resPromotion?.data.promotionUsed?.find(p => p.code === code);
            if (promotionExist) {
                toast.info(i18n.t('cart.promotion.isUsed'));
            } else if (!promotionAvailable) {
                toast.info(i18n.t('cart.promotion.null'));
            } else {
                toast.success(i18n.t('cart.promotion.success'));
                promotionCode = code;
                localStorage.setItem('promotionCode', JSON.stringify(promotionCode));
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
