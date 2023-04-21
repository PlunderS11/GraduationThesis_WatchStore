const router = require('express').Router();

const { verifyTokenAndAdmin } = require('../middleware/verifyToken');
const Notification = require("../models/notificationModel");

//CREATE
// router.post('/admin/new',verifyTokenAndAdmin, async (req, res) => {
//     try {
//         const notification = await Notification.create({
//             ...req.body,
//             from: "admin",
//             mode: "global",
//         });
//         res.status(200).json({ data: { notification:notification }, message: 'success', status: 200 });
//     } catch (error) {
//         res.status(500).json({ data: {}, message: error.message, status: 500 });
//     }
// });

//GET ALL OF ADMIN
router.get('/admin/',verifyTokenAndAdmin, async (req, res) => {
    try {
        const notifications = await Notification.find({
            isDeleted: false,
            mode: "global",
        }).populate(["user", "order"]).sort({ createdAt: "desc" });
        res.status(200).json({ data: { notifications:notifications, total: notifications.length }, message: 'success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

//GET ALL OF USER
router.get('/', async (req, res) => {
    try {
        let options = {};
    if (req.query.type === "admin") {
        options = { ...options, from: "admin", type: "normal" };
    } else if (req.query.type === "order") {
        options = { ...options, type: "order" };
    }
    const notifications = await Notification.find({
        isDeleted: false,
        lastSendAt: { $gt: 0 },
        ...options,
        $or: [{ user: req.user._id }, { mode: "global" }, options],
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
        const notification = await Notification.findById(req.params.id).populate([
            "user",
            "order",
        ]);
        res.status(200).json({ data: {notification:notification}, message: 'delete success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

module.exports = router;

