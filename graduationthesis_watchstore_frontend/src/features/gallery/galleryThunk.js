import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosClient, { Instagram } from '../../api/axiosClient';

export const galleryFetchProducts = createAsyncThunk('gallery/galleryFetchProducts', async payload => {
    const res = await axiosClient.get(`/product/link/?id=${payload.slugString}`);
    return res.data;
});

export const galleryFetchImageInstagram = createAsyncThunk('gallery/galleryFetchImageInstagram', async () => {
    const res = await Instagram.get(
        `me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=IGQVJXNkV4bU1UZA3Q3NjljeF95eExfY2ZAiVGRjZAVB6UnhhR3ZArS1FuZAmIwSEpMcjkwTHNpblJZAemJvSnZANTXQ4SThXMTlHZAjAyLTZAOd080SjFuZA3EtbE9KU01jajdMZAFduN1A3YWpldzNwcDVfS2JESgZDZD`
    );
    return res.data;
});
