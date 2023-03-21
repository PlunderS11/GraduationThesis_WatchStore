const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
        },
        code: {
            type: String,
            require: true,
        },
        value: {
            type: Number,
            require: true,
        },
        startDate: {
            type: Date,
            require: true,
        },
        endDate: {
            type: Date,
            require: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
            require: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Promotion', PromotionSchema);
