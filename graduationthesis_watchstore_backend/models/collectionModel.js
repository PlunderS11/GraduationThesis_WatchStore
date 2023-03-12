const mongoose = require('mongoose');

const CollectionSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    descriptionvi: {
        type: String,
        require: true,
    },
    descriptionen: {
        type: String,
        require: true,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

module.exports = mongoose.model('Collection', CollectionSchema);
