import { createSlice, nanoid } from '@reduxjs/toolkit';
import * as _ from 'lodash';

const initialState = {
    items: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: {
            reducer(state, action) {
                const { id, option } = action.payload;

                const existsItem = state.items.find(item => item.id === id && _.isEqual(item.option, option));

                if (existsItem) {
                    existsItem.amount++;
                } else {
                    state.items.push(action.payload);
                }

                localStorage.setItem('cartItems', JSON.stringify(state.items));
            },
            prepare(id, name, price, link, image, option) {
                return {
                    payload: {
                        cartId: nanoid(),
                        amount: 1,
                        id,
                        name,
                        price,
                        link,
                        image,
                        option,
                    },
                };
            },
        },
        updateCartItem(state, action) {
            const { cartId, type } = action.payload;

            const existsItem = state.items.find(item => item.cartId === cartId);

            if (type === 'increase') {
                existsItem.amount++;
            } else if (type === 'decrease') {
                if (existsItem.amount > 1) {
                    existsItem.amount--;
                } else {
                    state.items = state.items.filter(item => item.cartId !== existsItem.cartId);
                }
            }
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        removeItem(state, action) {
            const { cartId } = action.payload;

            state.items = state.items.filter(item => item.cartId !== cartId);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
    },
});

export default cartSlice.reducer;

export const { addToCart, changeStatus, updateCartItem, removeItem } = cartSlice.actions;
