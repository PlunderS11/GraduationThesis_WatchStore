const mongoose = require('mongoose');

const CollectionSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        descriptionvi: {
            type: String,
            required: true,
        },
        descriptionen: {
            type: String,
            required: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Collection', CollectionSchema);
