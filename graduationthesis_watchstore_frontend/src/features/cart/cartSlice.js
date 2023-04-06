import { createSlice } from '@reduxjs/toolkit';
import { fetchEstimate } from './cartThunk';

const initialState = {
    items: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    estimate: {},
    isLoadingCart: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            try {
                state.isLoadingCart = true;
                const existsItem = state.items.find(item => item.product._id === action.payload.product._id);
                if (existsItem) {
                    existsItem.quantity += action.payload.quantity;
                } else {
                    state.items.push(action.payload);
                }
                localStorage.setItem('cartItems', JSON.stringify(state.items));
            } finally {
                state.isLoadingCart = false;
            }
        },

        updateCartItem(state, action) {
            try {
                const existsItem = state.items.find(item => item.product._id === action.payload.product._id);
                const type = action.payload.type;
                switch (type) {
                    case 'increase':
                        existsItem.quantity++;
                        break;
                    case 'decrease':
                        if (existsItem.quantity > 1) {
                            existsItem.quantity--;
                        } else {
                            state.items = state.items.filter(item => item.product._id !== existsItem.product._id);
                        }
                        break;
                    case 'quantity':
                        existsItem.quantity += action.payload.quantity;
                        break;
                    default:
                        break;
                }
                localStorage.setItem('cartItems', JSON.stringify(state.items));
            } finally {
                state.isLoadingCart = false;
            }
        },
        removeItem(state, action) {
            try {
                state.isLoadingCart = true;
                state.items = state.items.filter(item => item.product._id !== action.payload.product._id);
                localStorage.setItem('cartItems', JSON.stringify(state.items));
            } finally {
                state.isLoadingCart = false;
            }
        },
        clearCart(state, action) {
            try {
                state.isLoadingCart = true;
                localStorage.removeItem('cartItems');
            } finally {
                state.isLoadingCart = false;
            }
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchEstimate.pending, (state, action) => {
                state.isLoadingCart = true;
            })
            .addCase(fetchEstimate.fulfilled, (state, action) => {
                state.estimate = action.payload;
                state.isLoadingCart = false;
            })
            .addCase(fetchEstimate.rejected, (state, action) => {
                // state.isLoadingCart = false;
            });
    },
});

export default cartSlice.reducer;

export const { addToCart, changeStatus, updateCartItem, removeItem, clearCart } = cartSlice.actions;
