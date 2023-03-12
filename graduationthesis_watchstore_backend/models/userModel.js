const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
        phone: {
            type: String,
            require: true,
            default: '',
        },
        address: {
            type: String,
            require: true,
            default: '',
        },
        sex: {
            type: String,
            require: true,
            default: '',
        },
        role: {
            type: String,
            default: 'user',
            require: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
