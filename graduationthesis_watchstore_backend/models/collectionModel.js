const mongoose = require('mongoose');

const CollectionSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        descriptionvi: {
            type: String,
            require: true,
        },
        descriptionen: {
            type: String,
            require: true,
        },
        isDelete: {
            type: Boolean,
            require: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Collection', CollectionSchema);
