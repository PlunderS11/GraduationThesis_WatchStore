const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        originalPrice: {
            type: Number,
            required: true,
        },
        finalPrice: {
            type: Number,
            required: true,
        },
        sex: {
            type: String,
            required: true,
        },
        images: {
            type: Array,
            required: true,
        },
        collectionName: {
            type: String,
            required: true,
        },
        descriptionvi: {
            type: String,
            required: true,
        },
        descriptionen: {
            type: String,
            required: true,
        },
        featuresvi: {
            type: Array,
            required: true,
        },
        featuresen: {
            type: Array,
            required: true,
        },
        note: {
            type: String,
        },
        sold: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
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

module.exports = mongoose.model('Product', ProductSchema);
