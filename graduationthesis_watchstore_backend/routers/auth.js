const router = require('express').Router();
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const User = require('../models/userModel');
const Rank = require('../models/rankModel');

//REGISTER
router.post('/register', async (req, res) => {
    try {
        const rank = await Rank.findOne({ nameen: 'Unrank' }).exec();
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString(),
            rank,
        });

        const user = await newUser.save();
        const accessToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        );

        res.status(200).json({ data: { token: accessToken }, message: 'success', status: 200 });
    } catch (err) {
        console.log(err);
        res.status(500).json({ data: {}, message: err, status: 500 });
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            res.status(404).json({ data: {}, message: 'User not found!', status: 404 });
        } else {
            const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET);

            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

            const inputPassword = req.body.password;

            if (originalPassword != inputPassword) {
                res.status(500).json({ data: {}, message: 'Wrong Password', status: 500 });
            } else {
                const accessToken = jwt.sign(
                    {
                        id: user._id,
                        role: user.role,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '3d' }
                );
                res.status(200).json({ data: { token: accessToken }, message: 'success', status: 200 });
            }
        }
    } catch (err) {
        res.status(500).json({ data: {}, message: err, status: 500 });
    }
});

//CHANGE PASSWORD
router.put('/changepassword/:id', async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id});

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET);
        
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        
        const inputPassword = req.body.password;
        
        if (originalPassword != inputPassword) {
            res.status(500).json({ data: {}, message: 'Wrong Password', status: 500 });
        } else {
            const changePassword = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: { password: CryptoJS.AES.encrypt(req.body.newPassword, process.env.PASS_SECRET).toString()},
                },
                { new: true }
                );
                
                res.status(200).json({ data: { changePassword: changePassword }, message: 'success', status: 200 });
            }
        
    } catch (err) {
        res.status(500).json({ data: {}, message: err, status: 500 });
    }
});

module.exports = router;
