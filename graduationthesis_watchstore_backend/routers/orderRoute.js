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

        // check promotion
        var promotion = {};
        var promotionExist = {};
        if (req.body.promotionCode) {
            promotion = await Promotion.findOne({ code: req.body.promotionCode });
            const allPromotion = await Order.find().populate('user').populate('promotion').exec();
            promotionExist = allPromotion.find(
                item => item.user._id.toString() === req.user.id && item.promotion.code === req.body.promotionCode
            );
        }
        let discountValue = 0;
        if (promotion.value) {
            if (promotion.isDelete)
                return res.status(406).json({ data: {}, message: 'Khuyến mãi không tồn tại', status: 406 });
            if (new Date().getTime() < promotion.startDate.getTime())
                return res.status(407).json({ data: {}, message: 'Khuyến mãi chưa bắt đầu', status: 407 });
            if (new Date().getTime() > promotion.endDate.getTime())
                return res.status(408).json({ data: {}, message: 'Khuyến mãi đã hết', status: 408 });
            if (promotionExist)
                return res.status(409).json({ data: {}, message: 'Khuyến mãi đã được sử dụng', status: 409 });
            else {
                discountValue = promotion.value;
            }
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
        const discountPrice = (productPrice * discountValue) / 100;
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
        res.status(500).json({ data: {}, message: error.message, status: 500 });
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
        var promotion = {};
        var promotionExist = {};
        if (req.body.promotionCode) {
            promotion = await Promotion.findOne({ code: req.body.promotionCode });
            const allPromotion = await Order.find().populate('user').populate('promotion').exec();
            promotionExist = allPromotion.find(
                item => item.user._id.toString() === req.user.id && item.promotion.code === req.body.promotionCode
            );
        }
        // check da su dung ma KM chua
        let discountValue = 0;
        if (promotion.value) {
            if (promotion.isDelete)
                return res.status(406).json({ data: {}, message: 'Khuyến mãi không tồn tại', status: 406 });
            if (new Date().getTime() < promotion.startDate.getTime())
                return res.status(407).json({ data: {}, message: 'Khuyến mãi chưa bắt đầu', status: 407 });
            if (new Date().getTime() > promotion.endDate.getTime())
                return res.status(408).json({ data: {}, message: 'Khuyến mãi đã hết', status: 408 });
            if (promotionExist)
                return res.status(409).json({ data: {}, message: 'Khuyến mãi đã được sử dụng', status: 409 });
            else {
                discountValue = promotion.value;
            }
        }
        const products = req.body.products;
        const distancePrice = await estimate(req.body.districtId, req.body.wardId);
        const lead = await leadtime(req.body.districtId, req.body.wardId);

        // check ton kho
        let check = true;
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].productId);
            if (products[i].quantity > product.stock) {
                check = false;
                break;
            }
        }

        let orderDetails = [];
        let productPrice = 0;
        if (check) {
            for (let i = 0; i < products.length; i++) {
                const product = await Product.findById(products[i].productId);

                const orderDetail = new OrderDetail({
                    product,
                    quantity: products[i].quantity,
                    originalPrice: product.originalPrice,
                    finalPrice: product.finalPrice,
                });
                await orderDetail.save();
                await Product.findByIdAndUpdate(products[i].productId, {
                    $set: {
                        sold: product.sold + products[i].quantity,
                        stock: product.stock - products[i].quantity,
                    },
                });
                productPrice += product.finalPrice * products[i].quantity;
                orderDetails.push(orderDetail);
            }
            const user = await User.findById(req.user.id);
            const { password, ...orther } = user._doc;
            const discountPrice = (productPrice * discountValue) / 100;

            let order = new Order({
                user: { ...orther },

                promotion: promotion.value ? promotion : null,
                orderDetails,
                recipient: {
                    username: req.body.username,
                    phone: req.body.phone,
                    addressProvince,
                    addressDistrict,
                    addressWard,
                    address: req.body.address,
                },
                code: `DH${new Date().getTime()}`,
                note: req.body.note ? req.body.note : '',
                paymentStatus: 'PENDING',
                paymentType: req.body.paymentType,
                status: {
                    state: 'PENDING',
                    pendingDate: new Date(),
                    packageDate: new Date(),
                    deliveringDate: new Date(),
                    completeDate: new Date(),
                    cancelDate: new Date(),
                },
                originalPrice: productPrice,
                shipPrice: distancePrice,
                discountPrice,
                finalPrice: productPrice - discountPrice + distancePrice,
                leadtime: new Date(lead * 1000).toISOString(),
            });
            await order.save();
            res.status(200).json({ data: { order }, message: 'success', status: 200 });
        } else {
            return res.status(407).json({ data: {}, message: 'Mặt hàng hiện đã hết', status: 406 });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error, status: 500 });
    }
});

// CANCEL ORDER
router.post('/cancel', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order = await Order.findById(req.body.orderId)
            .populate({
                path: 'orderDetails',
                populate: {
                    path: 'product',
                },
            })
            .exec();
        if (order.status.state === 'PENDING') {
            for (let i = 0; i < order.orderDetails.length; i++) {
                const element = order.orderDetails[i];
                await Product.findByIdAndUpdate(element.product._id, {
                    $set: {
                        sold: element.product.sold - element.quantity,
                        stock: element.product.stock + element.quantity,
                    },
                });
            }
            await Order.findByIdAndUpdate(req.body.orderId, {
                $set: {
                    status: {
                        ...order.status._doc,
                        state: 'CANCELED',
                    },
                },
            });
            res.status(200).json({ data: {}, message: 'success', status: 200 });
        } else {
            return res.status(502).json({ data: {}, message: 'Không thể hủy đơn hàng này', status: 502 });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// UPDATE STATUS ORDER
router.put('/status/update/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        var status = {};
        switch (req.body.status) {
            case 'PENDING':
                status = {
                    ...order.status._doc,
                    state: 'PENDING',
                    pendingDate: new Date(),
                };
                break;
            case 'PACKAGE':
                status = {
                    ...order.status._doc,
                    state: 'PACKAGE',
                    packageDate: new Date(),
                };
                break;
            case 'DELIVERING':
                status = {
                    ...order.status._doc,
                    state: 'DELIVERING',
                    deliveringDate: new Date(),
                };
                break;
            case 'COMPLETE':
                status = {
                    ...order.status._doc,
                    state: 'COMPLETE',
                    completeDate: new Date(),
                };
                break;
            case 'CANCEL':
                 status = {
                    ...order.status._doc,
                    state: 'CANCEL',
                    cancelDate: new Date(),
                };
                break;
            default:
                break;
        }
        const orderUpdate = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status,
                },
            },
            { new: true }
        );

        res.status(200).json({ data: { collection: orderUpdate }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: eerror.messagerror, status: 500 });
    }
});

// UPDATE INFOR ORDER
router.put('/info/update/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const orderUpdate = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    'recipient.username': req.body.username,
                    'recipient.phone': req.body.phone,
                },
            },
            { new: true }
        );

        res.status(200).json({ data: { orderUpdate }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.messagerror, status: 500 });
    }
});

// GET ALL ORDER
// ADMIN
router.get('/admin', verifyTokenAndAdmin, async (req, res) => {
    try {
        const orderList = await Order.find()
            .populate('user')
            .populate('orderDetails')
            .populate('promotion')
            .sort({ dateOrdered: -1 })
            .exec();
        res.status(200).json({ data: { orderList, total: orderList.length }, message: 'success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// GET ORDER BY ID
// ADMIN
router.get('/admin/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id})
            .populate('user')
            .populate({
                path: 'orderDetails',
                populate: {
                    path: 'product',
                },
            })
            .populate('promotion')
            .exec();
        res.status(200).json({ data: { order: order }, message: 'success', status: 200 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
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
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

module.exports = router;
