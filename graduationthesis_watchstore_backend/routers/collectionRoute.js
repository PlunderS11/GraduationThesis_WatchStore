const router = require('express').Router();

const Collection = require('../models/collectionModel');
const Product = require('../models/productModel');

// GET PRODUCT BY CATEGORY
router.get('/', async (req, res) => {
    try {
        const prod = await Collection.find().populate('products').exec();
        const prodCategory = prod.reduce((acc, cur) => {
            cur.products = cur.products.filter(i =>
                req.query.sex && req.query.type
                    ? i.sex === req.query.sex && req.query.type.split(',').includes(i.type)
                    : i.sex === req.query.sex || req.query.type.split(',').includes(i.type)
            );
            acc.push(cur);
            return acc;
        }, []);
        res.status(200).json(prodCategory);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
