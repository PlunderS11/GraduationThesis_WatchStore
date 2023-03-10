const router = require('express').Router();

const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken');
const Product = require('../models/productModel');
const Collection = require('../models/collectionModel');
const Option = require('../models/optionModel');

// POST
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const docCol = await Collection.findOne({ name: req.body.collectionName });
        // CREATE OPTION IF BOX
        if (req.body.type === 'box') {
            const docOption = await new Option({ link: req.body.link });
            req.body.watchs && docOption.watchs.push(...req.body.watchs);
            req.body.straps && docOption.straps.push(...req.body.straps);
            await docOption.save();
        }
        docCol.products.push(newProduct);
        const savedProduct = await newProduct.save();
        await docCol.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});

// UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updateProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// DELETE
router.delete('/delete:/id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json('Product has been deleted...');
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET PRODUCT BY LINK INSTAGRAM
router.get('/link', async (req, res) => {
    try {
        const product = await Product.findOne({ link: req.query.link }).exec();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET ALL PRODUCT
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// GET PRODUCT HOME
router.get('/home', async (req, res) => {
    let product = [];
    try {
        let sellingProducts = await Product.find().sort('-sold').limit(3);
        let manProducts = await Product.find({ sex: { $in: ['m'] } });
        let womanProducts = await Product.find({ sex: { $in: ['w'] } });
        product.push(sellingProducts, manProducts, womanProducts);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET PRODUCT DETAIL
router.get('/detail/:slug/:amount', async (req, res) => {
    try {
        const detail = await Product.findOne({ link: req.params.slug }).exec();
        const related = await Collection.find().populate('products').find({ name: detail.collectionName }).exec();
        const relatedProducts = related[0].products
            .filter(item => item.link !== req.params.slug)
            .slice(0, req.params.amount);
        const detailProduct = {
            detail,
            relatedProducts,
        };
        res.status(200).json(detailProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// GET PRODUCT VIEWED
router.get('/viewed', async (req, res) => {
    try {
        const productViewed = await Product.find({ _id: { $in: [...req.query.id.split(',')] } });
        res.status(200).json(productViewed);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET PRODUCT OPTIONS
router.get('/options/:slug', async (req, res) => {
    try {
        const w = await Option.findOne({ link: req.params.slug }).populate('watchs').exec();
        const s = await Option.find({ link: req.params.slug }).populate('straps').exec();

        const option = { watchs: w.watchs || [], straps: s.straps || [] };
        res.status(200).json(option);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

module.exports = router;
