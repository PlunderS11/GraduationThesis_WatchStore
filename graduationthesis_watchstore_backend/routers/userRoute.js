const router = require('express').Router();
const CryptoJS = require('crypto-js');

const User = require('../models/userModel');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken');

router.get('/userInfo', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { password, ...other } = user._doc;
        res.status(200).json({ data: { ...other }, message: 'Success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString();
    }
    try {
        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({ data: { ...updateUser }, message: 'Success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// DELETE
router.delete('delete:/id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.params.id,
            {
                isDelete: true,
            },
            {
                new: true,
            }
        );
        res.status(200).json({ data: {}, message: 'User has been deleted...', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// GET USER
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...other } = user._doc;
        res.status(200).json({ data: { ...other }, message: 'Success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
        res.status(200).json({ data: { ...users }, message: 'Success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

module.exports = router;
