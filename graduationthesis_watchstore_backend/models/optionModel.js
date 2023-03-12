const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    link: { type: String, require: true },
    watchs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    straps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

module.exports = mongoose.model('Option', OptionSchema);
