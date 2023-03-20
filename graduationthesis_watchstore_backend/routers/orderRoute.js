const router = require('express').Router();
const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const Promotion = require('../models/promotionModel');
const Product = require('../models/productModel');
const { verifyTokenAndAuthorization } = require('../middleware/verifyToken');
const { estimate, leadtime } = require('../utils/config');
const User = require('../models/userModel');

router.post('/estimate', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const products = req.body.products;
        let discount = 1;
        if (req.body.promotionCode) {
            discount = await Promotion.findOne({ code: req.body.promotionCode });
        }
        const distancePrice = await estimate(req.body.districtId, req.body.wardId);

        let productPrice = 0;
        let productDetails = [];
        if (products) {
            for (let i = 0; i < products.length; i++) {
                const product = await Product.findById(products[i].productId);
                if (product) {
                    productPrice += product.price * products[i].quantity;
                    productDetails.push({
                        product,
                        quantity: products[i].quantity,
                    });
                }
            }
        }
        const user = await User.findById(req.user.id);
        const discountPrice = discount ? (productPrice * discount.value) / 100 : 0;
        if (user && distancePrice && productPrice > 0) {
            res.status(200).json({
                data: {
                    user,
                    productDetails,
                    distancePrice,
                    discountPrice,
                    totalPrice: productPrice,
                    finalPrice: productPrice - discountPrice + distancePrice,
                },
                message: 'success',
                status: 200,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

router.post('/', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const products = req.body.products;
        const distancePrice = await estimate(req.body.districtId, req.body.wardId);
        const lead = await leadtime(req.body.districtId, req.body.wardId);

        let promotion = {};
        if (req.body.promotionCode) {
            promotion = await Promotion.findOne({ code: req.body.promotionCode });
        }
        let orderDetails = [];
        let productPrice = 0;
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].productId);
            if (product) {
                const orderDetail = new OrderDetail({
                    product,
                    quantity: products[i].quantity,
                    price: product.price * products[i].quantity,
                });
                // await orderDetail.save();
                productPrice += product.price * products[i].quantity;
                orderDetails.push(orderDetail);
            }
        }
        const user = await User.findById(req.user.id);
        const discountPrice = promotion.value ? (productPrice * promotion.value) / 100 : 0;

        let order = new Order({
            user,
            promotion: promotion.value ? promotion : null,
            orderDetails,
            note: req.body.note ? req.body.note : '',
            paymentStatus: 'PENDING',
            paymentType: req.body.paymentType,
            status: 'PENDING',
            phone: req.body.phone,
            address: req.body.address,
            originalPrice: productPrice,
            shipPrice: distancePrice,
            discountPrice,
            finalPrice: productPrice - discountPrice + distancePrice,
            leadtime: new Date(lead * 1000).toISOString(),
        });
        await order.save();

        res.status(200).json({ data: { order }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

router.get('/', async (req, res) => {
    const orderList = await Order.find()
        .populate('user')
        .populate('orderDetails')
        .populate('promotion')
        .sort({ dateOrdered: -1 })
        .exec();

    if (!orderList) {
        res.status(500).json({ success: false });
    }
    res.send(orderList);
});

module.exports = router;
