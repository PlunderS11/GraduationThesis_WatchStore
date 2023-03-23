const router = require('express').Router();
const { verifyTokenAndAdmin } = require('../middleware/verifyToken');
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
        });
        await newPromotion.save();
        res.status(200).json({ data: { newPromotion }, message: 'success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

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
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

// DELETE
router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
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
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

module.exports = router;
