const mongoose = require('mongoose');

const OrderDetailSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        required: true,
    },
    originalPrice: {
        type: Number,
        require: true,
    },
    finalPrice: {
        type: Number,
        require: true,
    },
});

module.exports = mongoose.model('OrderDetail', OrderDetailSchema);
