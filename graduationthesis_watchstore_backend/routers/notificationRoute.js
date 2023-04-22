const router = require('express').Router();

const { verifyTokenAndAdmin } = require('../middleware/verifyToken');
const Notification = require("../models/notificationModel");

//GET ALL OF ADMIN
router.get('/admin/',verifyTokenAndAdmin, async (req, res) => {
    try {
        const notifications = await Notification.find({
            isDeleted: false,
            from:"customer"
        }).populate(["user", "order"]).sort({ createdAt: "desc" });
        res.status(200).json({ data: { notifications:notifications, total: notifications.length }, message: 'success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

//GET ALL OF ADMIN
router.get('/admin/notseen/',verifyTokenAndAdmin, async (req, res) => {
    try {
        const notifications = await Notification.find({
            isDeleted: false,
            from:"customer",
            isSeen: false
        }).populate(["user", "order"]).sort({ createdAt: "desc" });
        res.status(200).json({ data: { notifications:notifications, total: notifications.length }, message: 'success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

//GET ALL OF USER
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find({
            'user._id': req.body.id,
            isDeleted: false,
            lastSendAt: { $gt: 0 },
            from:"admin",
        })
        .populate(["user", "order"])
        .sort({ createdAt: "desc" });
        res.status(200).json({ data: { notifications:notifications, total: notifications.length }, message: 'success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

//DELETE
router.put('/:id',verifyTokenAndAdmin, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        notification.isDeleted = true;

        await Notification.save(notification);
        res.status(200).json({ data: {}, message: 'delete success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

//GET DETAIL
router.get('/detail/:id', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id)
        .populate("user")
        .populate({
            path: "order",
            populate: {
                path: "orderDetails",
            },
        });
        res.status(200).json({ data: {notification:notification}, message: 'delete success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

//IS SEENED
router.put('/seen/:id', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            {
                $set: { isSeen: true },
            },
            { new: true }
        );
        res.status(200).json({ data: {notification:notification}, message: 'seen success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

module.exports = router;

