const router = require('express').Router();

const { verifyTokenAndAdmin } = require('../middleware/verifyToken');

const Collection = require('../models/collectionModel');
const Product = require('../models/productModel');

// GET PRODUCT BY CATEGORY
router.get('/', async (req, res) => {
    try {
        const prod = await Collection.find({ isDelete: false }).populate('products').exec();
        const prodCategory = prod.reduce((acc, cur) => {
            cur.products = cur.products.filter(i =>
                req.query.sex && req.query.type
                    ? i.sex === req.query.sex && req.query.type.split(',').includes(i.type)
                    : i.sex === req.query.sex || req.query.type.split(',').includes(i.type)
            );
            acc.push(cur);
            return acc;
        }, []);
        res.status(200).json({ data: { prodCategory: prodCategory }, message: 'success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

//GET ALL COLLECTIONS
router.get('/allCols/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const collections = query ? await Collection.find().sort({ _id: -1 }).limit(5) : await Collection.find();

        res.status(200).json({ data: { collections: collections }, message: 'success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

//POST COLLECTION
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const newCollection = new Collection(req.body);

        const savedProduct = await newCollection.save();

        res.status(200).json({ data: { collection: savedProduct }, message: 'success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

// DELETE COLLECTION
router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Collection.findByIdAndUpdate(
            req.params.id,
            {
                isDelete: false,
            },
            { new: true }
        );

        res.status(200).json({ data: {}, message: 'Delete collection success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

module.exports = router;