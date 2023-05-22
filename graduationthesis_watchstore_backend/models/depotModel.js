const mongoose = require('mongoose');

const DepotSchema = mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        importPrice: {
            type: Number,
            required: true,
        },
        totalImport: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Depot', DepotSchema);
