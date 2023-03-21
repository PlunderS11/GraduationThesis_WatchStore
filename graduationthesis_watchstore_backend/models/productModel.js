const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        brand: {
            type: String,
            require: true,
        },
        type: {
            type: String,
            require: true,
        },
        price: {
            type: Number,
            require: true,
        },
        sex: {
            type: String,
            require: true,
        },
        images: {
            type: String,
            require: true,
        },
        collectionName: {
            type: String,
            require: true,
        },
        link: {
            type: String,
            require: true,
        },
        descriptionvi: {
            type: String,
        },
        descriptionen: {
            type: String,
        },
        featuresvi: {
            type: Array,
        },
        featuresen: {
            type: Array,
        },
        note: {
            type: String,
        },
        sold: {
            type: Number,
            require: true,
        },
        stock: {
            type: Number,
            require: true,
        },
        isDelete: {
            type: Boolean,
            require: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
