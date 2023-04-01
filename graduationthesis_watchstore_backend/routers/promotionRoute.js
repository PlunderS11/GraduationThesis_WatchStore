const router = require('express').Router();
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('../middleware/verifyToken');
const Promotion = require('../models/promotionModel');

router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const startDate = new Date(req.body.startDate);
    const timestampsStart = Math.floor(startDate.getTime());
    const endDate = new Date(req.body.endDate);
    const timestampsEnd = Math.floor(endDate.getTime());
    try {
        const newPromotion = new Promotion({
            title: req.body.title,
            code: req.body.code,
            value: req.body.value,
            startDate: timestampsStart,
            endDate: timestampsEnd,
            isDelete: req.body.isDelete,
        });
        await newPromotion.save();
        res.status(200).json({ data: { newPromotion }, message: 'success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// UPDATE
// router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
//     try {
//         const updatePromotion = await Promotion.findByIdAndUpdate(
//             req.params.id,
//             {
//                 $set: req.body,
//             },
//             { new: true }
//         );

//         res.status(200).json({ data: { promotion: updatePromotion }, message: 'success', status: 200 });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ data: {}, message: error.message, status: 500 });
//     }
// });
// UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const startDate = req.body.startDate && new Date(req.body.startDate);
        const timestampsStart = startDate && Math.floor(startDate.getTime());
        const endDate = req.body.endDate && new Date(req.body.endDate);
        const timestampsEnd = endDate && Math.floor(endDate.getTime());
        console.log(timestampsStart, timestampsEnd);

        const updatePromotion = await Promotion.findByIdAndUpdate(
            req.params.id,
            {
                $set: { ...req.body, startDate: timestampsStart, endDate: timestampsEnd },
            },
            { new: true, omitUndefined: true }
        );

        res.status(200).json({ data: { promotion: updatePromotion }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// DELETE
router.put('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Promotion.findByIdAndUpdate(
            req.params.id,
            {
                isDelete: true,
            },
            { new: true }
        );

        res.status(200).json({ data: {}, message: 'Delete promotion success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// RESTORE
router.put('/restore/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Promotion.findByIdAndUpdate(
            req.params.id,
            {
                isDelete: false,
            },
            { new: true }
        );

        res.status(200).json({ data: {}, message: 'Restore promotion success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

//GET ALL PROMOTION
router.get('/', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const promotions = await Promotion.find();
        res.status(200).json({ data: { promotions: promotions }, message: 'success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// GET PROMOTION BY ID
router.get('/detail/:id', async (req, res) => {
    try {
        const promotion = await Promotion.findOne({ _id: req.params.id }).exec();

        res.status(200).json({ data: { detailPromotion: promotion }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

//GET PROMOTIONS UNDELETED
router.get('/undeleted/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const promotions_undeleted = await Promotion.find({ isDelete: false }).exec();

        res.status(200).json({ data: { promotions_undeleted: promotions_undeleted }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

//GET PROMOTIONS DELETED
router.get('/deleted/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const promotions_deleted = await Promotion.find({ isDelete: true }).exec();

        res.status(200).json({ data: { promotions_deleted: promotions_deleted }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

module.exports = router;
