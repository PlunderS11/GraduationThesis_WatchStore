import React, { useEffect, useState } from 'react';
import { NumberWithCommas } from '../../../functions';
import { useNavigate } from 'react-router-dom';
import { Divider, Spin, Table } from 'antd';
import classNames from 'classnames/bind';

import axiosClient from '../../../api/axiosClient';
import style from './Order.module.scss';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(style);

const OrderPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        fetchOrderHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchOrderHistory = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('order/customer');
            setOrderHistory(res.data.orders);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            key: 'code',
            title: t('table.codeOrder'),
            dataIndex: 'code',
            render: (value, record, index) => (
                <div
                    className="cart-product-info"
                    onClick={() => navigate(`/account/order-history/${record._id}`, { state: { record } })}
                    style={{ cursor: 'pointer' }}
                >
                    {value}
                </div>
            ),
        },
        {
            key: 'createdAt',
            title: t('table.product'),
            dataIndex: 'orderDetails',
            render: (value, record, index) =>
                value.map(item => (
                    <div
                        key={item._id}
                        className="cart-product-info"
                        onClick={() => navigate(`/account/order-history/${record._id}`, { state: { record } })}
                        style={{ cursor: 'pointer', wordBreak: 'break-all' }}
                    >
                        {item.product.name}
                        <Divider style={{ margin: 0 }} />
                    </div>
                )),
        },
        {
            key: 'updatedAt',
            title: t('table.price'),
            dataIndex: 'orderDetails',
            align: 'right',
            render: (value, record, index) =>
                value.map(item => (
                    <div key={item._id} className="cart-product-info">
                        {NumberWithCommas(item.product.finalPrice)}&nbsp;₫
                    </div>
                )),
        },
        {
            key: '_id',
            title: t('table.quantity'),
            dataIndex: 'orderDetails',
            align: 'center',
            render: (value, record, index) =>
                value.map(item => (
                    <div key={item._id} className="cart-product-info">
                        x{item.quantity}
                    </div>
                )),
        },
        {
            key: 'leadtime',
            title: t('table.status'),
            dataIndex: 'status',
            align: 'center',
            filters: [
                {
                    text: t('cart.status.pending'),
                    value: 'PENDING',
                },
                {
                    text: t('cart.status.package'),
                    value: 'PACKAGE',
                },
                {
                    text: t('cart.status.delivering'),
                    value: 'DELIVERING',
                },
                {
                    text: t('cart.status.completed'),
                    value: 'COMPLETE',
                },
                {
                    text: t('cart.status.canceled'),
                    value: 'CANCEL',
                },
            ],
            onFilter: (value, record) => record.status.state.indexOf(value) === 0,
            render: (value, record, index) => {
                var status = '';
                if (value.state === 'PENDING') {
                    status = t('cart.status.pending');
                } else if (value.state === 'PACKAGE') {
                    status = t('cart.status.package');
                } else if (value.state === 'DELIVERING') {
                    status = t('cart.status.delivering');
                } else if (value.state === 'COMPLETE') {
                    status = t('cart.status.completed');
                } else {
                    status = t('cart.status.canceled');
                }
                return <div className="cart-product-info">{status}</div>;
            },
        },
        {
            key: 'finalPrice',
            title: t('table.total'),
            dataIndex: 'finalPrice',
            sorter: (a, b) => a.finalPrice - b.finalPrice,
            render: (value, record, index) => (
                <div>
                    <span style={{ color: '#ff424e' }}>{NumberWithCommas(value)}&nbsp;₫</span>
                </div>
            ),
        },
    ];
    return (
        <div className={cx('profile__info')}>
            <div className={cx('profile__info-title')}>
                <h4 style={{ fontWeight: '700', fontSize: '20px' }}>{t('accountInfo.listOrder')}</h4>
            </div>
            <div style={{ border: '2px solid #f0f0f0' }}>
                <Spin spinning={loading}>
                    <Table rowKey={item => item._id} columns={columns} dataSource={orderHistory} bordered />
                </Spin>
            </div>
        </div>
    );
};

export default OrderPage;
