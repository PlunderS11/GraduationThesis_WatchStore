export const selectCartItems = state => state.cart.items;

export const selectTotalItems = state => {
    return state.cart.items.reduce((total, item) => (total += item.quantity), 0);
};

export const selectTotalPrice = state => {
    return state.cart.items.reduce((total, item) => (total += item.quantity * item.product.finalPrice), 0);
};
