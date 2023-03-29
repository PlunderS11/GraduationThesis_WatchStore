import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existsItem = state.items.find(item => item.product._id === action.payload.product._id);

            if (existsItem) {
                existsItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }

            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },

        updateCartItem(state, action) {
            const existsItem = state.items.find(item => item.product._id === action.payload.product._id);
            const type = action.payload.type;

            if (type === 'increase') {
                existsItem.quantity++;
            } else if (type === 'decrease') {
                if (existsItem.quantity > 1) {
                    existsItem.quantity--;
                } else {
                    state.items = state.items.filter(item => item.product._id !== existsItem.product._id);
                }
            }
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        removeItem(state, action) {
            state.items = state.items.filter(item => item.product._id !== action.payload.product._id);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
    },
});

export default cartSlice.reducer;

export const { addToCart, changeStatus, updateCartItem, removeItem } = cartSlice.actions;
