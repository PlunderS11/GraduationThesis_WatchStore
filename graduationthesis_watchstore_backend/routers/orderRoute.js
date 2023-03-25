const router = require('express').Router();
const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const Promotion = require('../models/promotionModel');
const Product = require('../models/productModel');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken');
const { estimate, leadtime, address } = require('../utils/config');
const User = require('../models/userModel');

// ESTIMATE
router.post('/estimate', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const province = await address('province');
        const addressProvince = province.find(item => item.ProvinceID === req.body.provinceId);
        const district = await address('district', req.body.provinceId);
        const addressDistrict = district.find(item => item.DistrictID === req.body.districtId);
        const ward = await address('ward', req.body.districtId);
        const addressWard = ward.find(item => item.WardCode === req.body.wardId);
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
                    productPrice += product.finalPrice * products[i].quantity;
                    productDetails.push({
                        product,
                        quantity: products[i].quantity,
                        originalPrice: product.originalPrice,
                        finalPrice: product.finalPrice,
                    });
                }
            }
        }
        const user = await User.findById(req.user.id);
        const { password, ...orther } = user._doc;
        const discountPrice = discount ? (productPrice * discount.value) / 100 : 0;
        if (user && distancePrice && productPrice > 0) {
            res.status(200).json({
                data: {
                    user: { ...orther },
                    addressProvince,
                    addressDistrict,
                    addressWard,
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

// POST ORDER
router.post('/', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const province = await address('province');
        const addressProvince = province.find(item => item.ProvinceID === req.body.provinceId);
        const district = await address('district', req.body.provinceId);
        const addressDistrict = district.find(item => item.DistrictID === req.body.districtId);
        const ward = await address('ward', req.body.districtId);
        const addressWard = ward.find(item => item.WardCode === req.body.wardId);
        let promotion = {};
        if (req.body.promotionCode) {
            promotion = await Promotion.findOne({ code: req.body.promotionCode });
        }
        if (promotion) {
            if (promotion.isDelete)
                return res.status(406).json({ data: {}, message: 'Khuyến mãi không tồn tại', status: 406 });
            else {
                const products = req.body.products;
                const distancePrice = await estimate(req.body.districtId, req.body.wardId);
                const lead = await leadtime(req.body.districtId, req.body.wardId);

                let orderDetails = [];
                let productPrice = 0;
                for (let i = 0; i < products.length; i++) {
                    const product = await Product.findById(products[i].productId);
                    if (product) {
                        const orderDetail = new OrderDetail({
                            product,
                            quantity: products[i].quantity,
                            originalPrice: product.originalPrice,
                            finalPrice: product.finalPrice,
                        });
                        await orderDetail.save();
                        productPrice += product.originalPrice * products[i].quantity;
                        orderDetails.push(orderDetail);
                    }
                }
                const user = await User.findById(req.user.id);
                const { password, ...orther } = user._doc;
                const discountPrice = promotion.value ? (productPrice * promotion.value) / 100 : 0;

                let order = new Order({
                    user: { ...orther },
                    addressProvince,
                    addressDistrict,
                    addressWard,
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
                console.log(addressProvince, addressDistrict, addressWard);
                await order.save();
                res.status(200).json({ data: { order }, message: 'success', status: 200 });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

// GET ALL ORDER
// ADMIN
router.get('/admin', verifyTokenAndAdmin, async (req, res) => {
    const orderList = await Order.find()
        .populate('user')
        .populate('orderDetails')
        .populate('promotion')
        .sort({ dateOrdered: -1 })
        .exec();

    if (!orderList) {
        res.status(500).json({ data: {orderList:orderList}, message: error, status: 500 });
    }
    res.status(200).json({ data: { orderList, total: orderList.length }, message: 'success', status: 200 });
});

// GET ALL ORDER BY ID USER
router.get('/customer', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orderList = await Order.find().populate('user').sort({ dateOrdered: -1 }).exec();
        const rs = orderList.filter(item => {
            return item.user._id.toString() == req.user.id;
        });
        res.status(200).json({ data: { orders: rs, total: rs.length }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

module.exports = router;
