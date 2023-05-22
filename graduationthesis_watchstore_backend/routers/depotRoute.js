const router = require('express').Router();
const Depot = require('../models/depotModel');
const Product = require('../models/productModel');

const { verifyTokenAndAdmin } = require('../middleware/verifyToken');

router.post('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.body.productId);
        await Product.findByIdAndUpdate(req.body.productId, {
            $set: { stock: product.stock + req.body.quantity },
        });
        const depot = new Depot({
            product,
            quantity: req.body.quantity,
            importPrice: req.body.importPrice,
            totalImport: req.body.quantity * req.body.importPrice,
        });
        await depot.save();
        res.status(200).json({ data: { depot }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// FIND ALL
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const depot = await Depot.find().populate('product').exec();
        const depots = depot.filter(d => d.product._id.toString() === req.query.productId);
        res.status(200).json({ data: { depots, total: depots.length }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

module.exports = router;
