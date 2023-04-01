const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: false,
            default: '',
        },
        address: {
            type: Object,
            required: false,
            default: {},
        },
        sex: {
            type: String,
            required: false,
            default: '',
        },
        role: {
            type: String,
            default: 'user',
            required: true,
        },
        rank: { type: mongoose.Schema.Types.ObjectId, ref: 'Rank', require: true },
        isDelete: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
