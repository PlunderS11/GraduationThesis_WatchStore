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
            required: true,
            default: '',
        },
        address: {
            type: String,
            required: true,
            default: '',
        },
        sex: {
            type: String,
            required: true,
            default: '',
        },
        role: {
            type: String,
            default: 'user',
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

module.exports = mongoose.model('User', UserSchema);
