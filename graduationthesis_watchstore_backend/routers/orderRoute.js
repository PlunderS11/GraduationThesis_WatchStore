const router = require('express').Router();
const KEY = process.env.STRIPE_KEY;
const stripe = require('stripe')(KEY);
const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const Promotion = require('../models/promotionModel');
const Product = require('../models/productModel');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken');
const { estimate, leadtime, address } = require('../utils/config');
const User = require('../models/userModel');
const Rank = require('../models/rankModel');
const { ObjectId } = require('bson');

const Notification = require('../models/notificationModel');
const OneSignal = require('../models/oneSignalModel');
const OneSignalUtil = require('../utils/onesignal');
// const OneSignalUtilUser = require("../utils/onesignalUser");
const moment = require('moment/moment');

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
                    promotion,
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
            const newUsers = [...promotion.users, req.user.id];
            await Promotion.findByIdAndUpdate(promotion._id, {
                $set: { users: newUsers },
            });
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

            const rs = rank.find(r => r.minValue < totalPriceOrderUser && totalPriceOrderUser < r.maxValue);
            //----------------------------------------------------------------
            const notification = {
                title: 'Tiếp nhận đơn hàng',
                content: `Đơn hàng #${order.code} đã được tiếp nhận.`,
                shortContent: `Đơn hàng #${order.code} đã được tiếp nhận.`,
                mode: `private`,
                user: req.user.id,
                order: order._id,
                from: 'admin',
                type: 'order',
                mode: 'private',
                lastSendAt: moment().unix(),
            };
            await Notification.create(notification);
            const oneSignals = await OneSignal.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                { $unwind: '$user' },
                { $match: { 'user.role': 'user' } },
            ]);
            if (oneSignals.length > 0) {
                await OneSignalUtil.pushNotification({
                    isAdmin: false,
                    heading: req.body.language === 'vi' ? 'Đơn hàng mới' : 'New order',
                    content:
                        req.body.language === 'vi'
                            ? `Đơn hàng #${order.code} vừa được tạo`
                            : `The order #${order.code} just created`,
                    data: {
                        type: 'ORDER',
                        orderId: order._id + '',
                    },
                    oneSignalPlayerIds: oneSignals.map(e => e.oneSignalId),
                    pathUrl: `/account/order-history/${order._id}`,
                });
            }

            const notificationAdmin = {
                title: 'Đơn hàng mới',
                content: `Đơn hàng #${order.code} vừa được tạo.`,
                shortContent: `Đơn hàng #${order.code} vừa được tạo.`,
                mode: `private`,
                user: req.user.id,
                order: order._id,
                from: 'customer',
                type: 'order',
                mode: 'private',
                lastSendAt: moment().unix(),
            };
            await Notification.create(notificationAdmin);

            const oneSignalsAdmin = await OneSignal.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                { $unwind: '$user' },
                { $match: { 'user.role': 'admin' } },
            ]);
            if (oneSignalsAdmin.length > 0) {
                await OneSignalUtil.pushNotification({
                    isAdmin: true,
                    heading: 'Đơn hàng mới',
                    content: `Đơn hàng #${order.code} vừa được tạo`,
                    data: {
                        type: 'ORDER',
                        orderId: order._id + '',
                    },
                    oneSignalPlayerIds: oneSignalsAdmin.map(e => e.oneSignalId),
                    pathUrl: '/orders',
                });
            }
            //----------------------------------------------------------------
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

// POST ORDER ONLINE
router.post('/stripePayment', verifyTokenAndAuthorization, async (req, res) => {
    try {
        stripe.charges.create(
            {
                source: req.body.stripe.tokenId,
                amount: req.body.stripe.amount,
                currency: 'VND',
            },
            async (stripeErr, stripeRes) => {
                if (stripeErr) {
                    res.status(500).json({ data: {}, message: 'striper' + stripeErr, status: 500 });
                } else {
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
                        await Promotion.findByIdAndUpdate(promotion._id, {
                            $set: { users: newUsers },
                        });
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
                            paymentStatus: 'COMPLETE',
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
                        const rs = rank.find(r => r.minValue < totalPriceOrderUser && totalPriceOrderUser < r.maxValue);
                        //----------------------------------------------------------------
                        const notification = {
                            title: 'Tiếp nhận đơn hàng',
                            content: `Đơn hàng #${order.code} đã được tiếp nhận.`,
                            shortContent: `Đơn hàng #${order.code} đã được tiếp nhận.`,
                            mode: `private`,
                            user: req.user.id,
                            order: order._id,
                            from: 'admin',
                            type: 'order',
                            mode: 'private',
                            lastSendAt: moment().unix(),
                        };

                        await Notification.create(notification);

                        const oneSignals = await OneSignal.aggregate([
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'user',
                                    foreignField: '_id',
                                    as: 'user',
                                },
                            },
                            { $unwind: '$user' },
                            { $match: { 'user.role': 'user' } },
                        ]);

                        if (oneSignals.length) {
                            await OneSignalUtil.pushNotification({
                                isAdmin: false,
                                heading: req.body.language === 'vi' ? 'Đơn hàng mới' : 'New order',
                                content:
                                    req.body.language === 'vi'
                                        ? `Đơn hàng #${order.code} vừa được tạo`
                                        : `The order #${order.code} just created`,
                                data: {
                                    type: 'ORDER',
                                    orderId: order._id + '',
                                },
                                oneSignalPlayerIds: oneSignals.map(e => e.oneSignalId),
                                pathUrl: '/account/orders',
                            });
                        }

                        const notificationAdmin = {
                            title: 'Đơn hàng mới',
                            content: `Đơn hàng #${order.code} vừa được tạo.`,
                            shortContent: `Đơn hàng #${order.code} vừa được tạo.`,
                            mode: `private`,
                            user: req.user.id,
                            order: order._id,
                            from: 'customer',
                            type: 'order',
                            mode: 'private',
                            lastSendAt: moment().unix(),
                        };
                        await Notification.create(notificationAdmin);

                        const oneSignalsAdmin = await OneSignal.aggregate([
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'user',
                                    foreignField: '_id',
                                    as: 'user',
                                },
                            },
                            { $unwind: '$user' },
                            { $match: { 'user.role': 'admin' } },
                        ]);
                        if (oneSignalsAdmin.length) {
                            await OneSignalUtil.pushNotification({
                                isAdmin: true,
                                heading: 'Đơn hàng mới',
                                content: `Đơn hàng #${order.code} vừa được tạo`,
                                data: {
                                    type: 'ORDER',
                                    orderId: order._id + '',
                                },
                                oneSignalPlayerIds: oneSignalsAdmin.map(e => e.oneSignalId),
                                pathUrl: '/orders',
                            });
                        }

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
                }
            }
        );
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
        let title = '',
            body = '';
        const storeName = 'MynhBakeStore';
        switch (req.body.status) {
            case 'PENDING':
                title = `${storeName} đang xử lý đơn hàng`;
                body = `Đơn hàng #${order.code} đang được ${storeName} xử lý.`;
                status = {
                    ...order.status._doc,
                    state: 'PENDING',
                    pendingDate: new Date(),
                };
                break;
            case 'PACKAGE':
                title = 'Đơn của bạn đang được đóng gói';
                body = `Đơn hàng #${order.code} của Quý Khách Hàng đang được đóng gói.`;
                status = {
                    ...order.status._doc,
                    state: 'PACKAGE',
                    packageDate: new Date(),
                };
                break;
            case 'DELIVERING':
                title = 'Đơn của bạn đang được vận chuyển';
                body = `Đơn hàng #${order.code} của Quý Khách Hàng đã được bàn giao cho đơn vị vận chuyển.`;
                status = {
                    ...order.status._doc,
                    state: 'DELIVERING',
                    deliveringDate: new Date(),
                };
                break;
            case 'COMPLETE':
                title = 'Đơn hàng đã được giao';
                body = `Đơn hàng #${order.code} của Quý Khách Hàng đã giao hoàn tất. ${storeName} xin tiếp nhận mọi đóng góp, khiếu nại qua Hotline và khẩn trương xác minh, phản hồi đến Quý Khách Hàng `;
                status = {
                    ...order.status._doc,
                    state: 'COMPLETE',
                    completeDate: new Date(),
                };
                break;
            case 'CANCEL':
                title = 'Đơn hàng đã được hủy';
                body = `Đơn hàng #${order.code} của Quý Khách Hàng vừa bị hủy.`;
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

        if (req.body.status === 'CANCEL' && order.paymentType === 'CASH') {
            await Order.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        paymentStatus: 'CANCEL',
                    },
                },
                { new: true }
            );
        } else if (req.body.status === 'CANCEL' && order.paymentType === 'ONLINE') {
            await Order.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        paymentStatus: 'REFUNDING',
                    },
                },
                { new: true }
            );
        }
        //-----------------------------------------------------------
        const oneSignal = await OneSignal.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            { $match: { 'user.role': 'user' } },
        ]);

        const data = {
            orderId: order._id + '',
            type: 'order',
        };

        const notification = {
            title: title,
            content: body,
            shortContent: body,
            mode: `private`,
            user: order.user._id,
            order: order._id,
            from: 'admin',
            type: 'order',
            mode: 'private',
            lastSendAt: moment().unix(),
        };

        const notificationSave = await Notification.create(notification);

        if (oneSignal.length > 0) {
            await OneSignalUtil.pushNotification({
                isAdmin: false,
                heading: title,
                content: body,
                data,
                pathUrl: `/account/order-history/${order._id}`,
                oneSignalPlayerIds: oneSignal.map(e => e.oneSignalId),
            });
            notificationSave.lastSendAt = moment().unix();
            await notificationSave.save();
        }
        //-----------------------------------------------------------

        res.status(200).json({ data: { collection: orderUpdate }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.messagerror, status: 500 });
    }
});

// UPDATE STATUS PAYMENTS
router.put('/statusPayment/update/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        const orderUpdate = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    paymentStatus: req.body.status,
                },
            },
            { new: true }
        );
        if (req.body.status === 'CANCEL') {
            await Order.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        status: {
                            ...order.status._doc,
                            state: 'CANCEL',
                            cancelDate: new Date(),
                        },
                    },
                },
                { new: true }
            );
        }
        if (req.body.status === 'COMPLETE') {
            await Order.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        status: {
                            ...order.status._doc,
                            state: 'COMPLETE',
                            completeDate: new Date(),
                        },
                    },
                },
                { new: true }
            );
        }
        res.status(200).json({ data: { orderUpdate: orderUpdate }, message: 'success', status: 200 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: {}, message: error.messagerror, status: 500 });
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
                              $lte: endDate,
                          }
                        : undefined,
            };
        }

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

// GET MONTHLY INCOME
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            {
                $lookup: {
                    from: 'orderdetails',
                    localField: 'orderDetails',
                    foreignField: '_id',
                    as: 'ordersData',
                },
            },
            {
                $unwind: '$ordersData',
            },
            {
                $match: {
                    createdAt: { $gte: previousMonth },
                    'ordersData.product': ObjectId(productId),
                },
            },
            {
                $project: {
                    month: { $month: '$createdAt' },
                    sales: '$ordersData.quantity',
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: '$sales' },
                },
            },
        ]);

        res.status(200).json({ data: { income: income }, message: 'success', status: 200 });
    } catch (err) {
        res.status(500).json({ data: {}, message: err.message, status: 500 });
    }
});

module.exports = router;
