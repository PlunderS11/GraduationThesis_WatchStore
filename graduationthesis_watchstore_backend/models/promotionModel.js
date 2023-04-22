const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema(
    {
        titlevi: {
            type: String,
            required: true,
        },
        titleen: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        users: {
            type: Array,
            require: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Promotion', PromotionSchema);
