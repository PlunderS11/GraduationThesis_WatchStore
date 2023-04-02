const router = require('express').Router();
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/userModel');
const Token = require('../models/token');
const Rank = require('../models/rankModel');
const sendEmail = require('../utils/sendEmail');

router.get('/:id/verify/:token/', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send({ message: 'Invalid link' });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send({ message: 'Invalid link' });

        await User.updateOne({ _id: user._id, verified: true });
        await token.remove();

        res.status(200).send({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

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

        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex'),
        }).save();
        const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, 'Verify Email', url);

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
                if (!user.verified) {
                    let token = await Token.findOne({ userId: user._id });
                    if (!token) {
                        token = await new Token({
                            userId: user._id,
                            token: crypto.randomBytes(32).toString('hex'),
                        }).save();
                        const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
                        await sendEmail(user.email, 'Verify Email', url);
                    }

                    return res.status(400).send({ message: 'An Email sent to your account please verify' });
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
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ data: {}, message: err, status: 500 });
    }
});

module.exports = router;
