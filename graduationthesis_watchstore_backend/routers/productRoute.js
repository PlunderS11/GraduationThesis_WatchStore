const router = require('express').Router();
const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const { v4: uuid } = require('uuid');
const dotenv = require('dotenv');

const { verifyTokenAndAdmin } = require('../middleware/verifyToken');
const Product = require('../models/productModel');
const Collection = require('../models/collectionModel');

dotenv.config();

const CLOUD_FRONT_URL = 'https://djr8hdvf9gux9.cloudfront.net/';

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESSKEY_ID,
    secretAccessKey: process.env.ACCESSKEY_SECRET,
});

const storage = multer.memoryStorage({
    destination(req, file, callback) {
        callback(null, '');
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 3000000 },
});

// POST
router.post('/', verifyTokenAndAdmin, upload.array('images', 10), async (req, res) => {
    const images = req.files;
    if (typeof images !== 'undefined') {
        if (images.length > 0) {
            var images_url = [];
            for (let i = 0; i < images.length; i++) {
                const image = images[i].mimetype;
                const fileType = image.split('/')[1];
                var filePath = `${uuid() + Date.now().toString()}.${fileType}`;
                const uploadS3 = {
                    Bucket: 'mynh-bake-store',
                    Key: filePath,
                    Body: images[i].buffer,
                };
                s3.upload(uploadS3, (err, data) => {
                    if (err) {
                        console.log('Loi s3: ' + err);
                    } else {
                        console.log('S3 thanh cong');
                    }
                });
                images_url.push(`${CLOUD_FRONT_URL}${filePath}`);
            }
            try {
                const newProduct = new Product({
                    name: req.body.name,
                    brand: req.body.brand,
                    type: req.body.type,
                    sex: req.body.sex,
                    images: images_url,
                    collectionId: req.body.collectionId,
                    descriptionvi: req.body.descriptionvi,
                    descriptionen: req.body.descriptionen,
                    featuresvi: req.body.featuresvi,
                    featuresen: req.body.featuresen,
                    note: req.body.note ? req.body.note : '',
                    originalPrice: Number(req.body.originalPrice),
                    finalPrice: Number(req.body.originalPrice),
                    sold: 0,
                    stock: Number(req.body.stock),
                });
                const docCol = await Collection.findById(req.body.collectionId);
                docCol.products.push(newProduct);
                const savedProduct = await newProduct.save();
                await docCol.save();
                res.status(200).json({ data: { product: savedProduct }, message: 'success', status: 200 });
            } catch (error) {
                console.log('Loi', error);
                res.status(500).json({ data: {}, message: error, status: 500 });
            }
        }
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

        res.status(200).json({ data: { product: updateProduct }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

// GET PRODUCT BY LINK INSTAGRAM
router.get('/link', async (req, res) => {
    try {
        const product = await Product.findOne({ link: req.query.link }).exec();
        res.status(200).json({ data: { product: product }, message: 'success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

// GET ALL PRODUCT
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ data: { products: products }, message: 'success', status: 200 });
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
        res.status(200).json({ data: { product: product }, message: 'success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error, status: 500 });
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
        res.status(200).json({ data: { detailProduct: detailProduct }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

// GET PRODUCT BY ID
router.get('/detail/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id }).exec();

        res.status(200).json({ data: { detailProduct: product }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

// GET PRODUCT VIEWED
router.get('/viewed', async (req, res) => {
    try {
        const productViewed = await Product.find({ _id: { $in: [...req.query.id.split(',')] } });

        res.status(200).json({ data: { productViewed: productViewed }, message: 'success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

// DELETE PRODUCt
router.put('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                isDelete: true,
            },
            { new: true }
        );

        res.status(200).json({ data: { product: updateProduct }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

// RESTORE PRODUCt
router.put('/restore/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                isDelete: false,
            },
            { new: true }
        );

        res.status(200).json({ data: { product: updateProduct }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

module.exports = router;
