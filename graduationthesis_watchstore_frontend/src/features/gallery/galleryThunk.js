import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosClient, { Instagram } from '../../api/axiosClient';

export const galleryFetchProducts = createAsyncThunk('gallery/galleryFetchProducts', async payload => {
    const res = await axiosClient.get(`/product/link/?id=${payload.slugString}`);
    return res.data;
});

export const galleryFetchImageInstagram = createAsyncThunk('gallery/galleryFetchImageInstagram', async () => {
    const res = await Instagram.get(
        `me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${process.env.REACT_APP_INSTAGRAM_TOKEN}`
    );
    return res.data;
});
