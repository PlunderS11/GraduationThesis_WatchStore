import { configureStore } from '@reduxjs/toolkit';

import productsReducer from '../features/products';
import loaderReducer from '../features/loader';
import cartReducer from '../features/cart';
import galleryReducer from '../features/gallery';
import userReducer from '../features/user';

export const store = configureStore({
    reducer: {
        products: productsReducer,
        loader: loaderReducer,
        cart: cartReducer,
        gallery: galleryReducer,
        user: userReducer,
    },
});
