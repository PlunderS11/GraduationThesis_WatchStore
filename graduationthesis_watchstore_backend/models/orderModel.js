const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion', require: false },
        orderDetails: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderDetail' }],
        note: {
            type: String,
            require: true,
        },
        paymentStatus: {
            type: String,
            require: true,
        },
        paymentType: {
            type: String,
            require: true,
        },
        status: {
            type: String,
            require: true,
        },
        address: {
            type: String,
            require: true,
        },
        phone: {
            type: String,
            require: true,
        },
        originalPrice: {
            type: Number,
            require: true,
        },
        shipPrice: {
            type: Number,
            require: true,
        },
        discountPrice: {
            type: Number,
            require: true,
        },
        finalPrice: {
            type: Number,
            require: true,
        },
        leadtime: {
            type: String,
            require: true,
        },
        dateOrdered: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
