const router = require('express').Router();
const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const Promotion = require('../models/promotionModel');
const Product = require('../models/productModel');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken');
const { estimate, leadtime, address } = require('../utils/config');
const User = require('../models/userModel');
const Rank = require('../models/rankModel');

// ESTIMATE
router.post('/estimate', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const products = req.body.products;
        const distancePrice = await estimate(req.body.district.DistrictID, req.body.ward.WardCode);
        var promotion = null;
        var discountValue = 0;
        if (req.body.promotionCode.trim().length > 0) {
            promotion = await Promotion.findOne({ code: req.body.promotionCode });
        }
        if (promotion) {
            discountValue = promotion.value;
        }
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
                    addressProvince: req.body.province,
                    addressDistrict: req.body.district,
                    addressWard: req.body.ward,
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
        const products = req.body.products;
        const distancePrice = await estimate(req.body.district.DistrictID, req.body.ward.WardCode);
        const lead = await leadtime(req.body.district.DistrictID, req.body.ward.WardCode);

        var promotion = null;
        var discountValue = 0;
        if (req.body.promotionCode.trim().length > 0) {
            promotion = await Promotion.findOne({ code: req.body.promotionCode });
        }
        if (promotion) {
            discountValue = promotion.value;
        }

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
            const user = await User.findById(req.user.id).populate('rank');
            const { password, ...orther } = user._doc;
            const discountPrice = (productPrice * discountValue) / 100;

            let order = new Order({
                user: { ...orther },

                promotion: promotion,
                orderDetails,
                recipient: {
                    username: req.body.username,
                    phone: req.body.phone,
                    addressProvince: req.body.province,
                    addressDistrict: req.body.district,
                    addressWard: req.body.ward,
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

            // Check rank
            const orderList = await Order.find()
                .populate('user')
                .populate('orderDetails')
                .populate('promotion')
                .sort({ dateOrdered: -1 })
                .exec();
            const rank = await Rank.find();
            const totalPriceOrderUser = orderList.reduce((acc, cur) => {
                if (cur.user._id.toString() == req.user.id) {
                    return acc + cur.finalPrice;
                }
            }, 0);

            console.log(totalPriceOrderUser);
            const rs = rank.find(r => r.minValue < totalPriceOrderUser && totalPriceOrderUser < r.maxValue);

            if (user.rank._id.toString() !== rs._id.toString()) {
                await User.findByIdAndUpdate(req.user.id, {
                    $set: { rank: rs },
                });
                res.status(201).json({ data: { order, rank: rs }, message: 'success', status: 201 });
            } else {
                res.status(200).json({ data: { order }, message: 'success', status: 200 });
            }
        } else {
            res.status(301).json({ data: {}, message: 'Mặt hàng hiện đã hết', status: 301 });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
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
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    try {
        var query = {};
        if (req.query) {
            query = {
                code: req.query.code,
                'status.state': req.query.status,
                'recipient.addressProvince.ProvinceID': req.query.ProvinceID ? Number(req.query.ProvinceID) : undefined,
                'recipient.addressDistrict.DistrictID': req.query.DistrictID ? Number(req.query.DistrictID) : undefined,
                'recipient.addressWard.WardCode': req.query.WardCode,
                dateOrdered:
                    req.query.startDate && req.query.endDate
                        ? {
                            $gte: startDate,
                            $lte: endDate
                          }
                        : undefined,
            };
        }
        console.log(query);
        const orderList = await Order.find({ ...query })
            .populate('user')
            .populate('orderDetails')
            .populate('promotion')
            .sort({ dateOrdered: -1 })
            .limit(req.query.new == 'true' ? 10 : 0)
            .exec();
        res.status(200).json({ data: { orderList, total: orderList.length }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// GET ORDER BY ID
// ADMIN
router.get('/admin/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id })
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
        const orderList = await Order.find()
            .populate('user')
            .populate({
                path: 'orderDetails',
                populate: {
                    path: 'product',
                },
            })
            .populate('promotion')
            .sort({ dateOrdered: -1 })
            .exec();
        const rs = orderList.filter(item => {
            return item.user._id.toString() == req.user.id;
        });
        res.status(200).json({ data: { orders: rs, total: rs.length }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// GET ORDER BY ID
router.get('/customer/:orderId', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('user')
            .populate({
                path: 'orderDetails',
                populate: {
                    path: 'product',
                },
            })
            .populate('promotion')
            .sort({ dateOrdered: -1 })
            .exec();
        res.status(200).json({ data: { order }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

module.exports = router;
