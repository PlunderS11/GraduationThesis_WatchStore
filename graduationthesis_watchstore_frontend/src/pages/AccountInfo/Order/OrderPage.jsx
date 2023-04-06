import React, { useEffect, useState } from 'react';
import { NumberWithCommas } from '../../../functions';
import { useNavigate } from 'react-router-dom';
import { Divider, Table } from 'antd';
import classNames from 'classnames/bind';

import axiosClient from '../../../api/axiosClient';
import style from './Order.module.scss';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(style);

const OrderPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        fetchOrderHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchOrderHistory = async () => {
        const res = await axiosClient.get('order/customer');
        setOrderHistory(res.data.orders);
    };

    const columns = [
        {
            key: 'code',
            title: t('table.codeOrder'),
            dataIndex: 'code',
            render: (value, record, index) => (
                <div
                    key={index}
                    className="cart-product-info"
                    onClick={() => navigate(`/account/order-history/${record._id}`, { state: { record } })}
                    style={{ cursor: 'pointer' }}
                >
                    {value}
                </div>
            ),
        },
        {
            key: 'product',
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
            key: 'price',
            title: t('table.price'),
            dataIndex: 'orderDetails',
            align: 'right',
            render: (value, record, index) =>
                value.map(item => (
                    <div key={item.product.id} className="cart-product-info">
                        {NumberWithCommas(item.product.finalPrice)}&nbsp;₫
                    </div>
                )),
        },
        {
            key: 'quantity',
            title: t('table.quantity'),
            dataIndex: 'orderDetails',
            align: 'center',
            render: (value, record, index) =>
                value.map(item => (
                    <div key={item.product.id} className="cart-product-info">
                        x{item.quantity}
                    </div>
                )),
        },
        {
            key: 'status',
            title: t('table.status'),
            dataIndex: 'status',
            align: 'center',
            render: (value, record, index) => {
                var status = '';
                if (value.state === 'PENDING') {
                    status = 'Đang chờ';
                } else if (value.state === 'PACKAGE') {
                    status = 'Đóng gói';
                } else if (value.state === 'DELIVERING') {
                    status = 'Đang vận chuyển';
                } else if (value.state === 'COMPLETE') {
                    status = 'Đã giao';
                } else {
                    status = 'Hủy';
                }
                return (
                    <div key={record.id} className="cart-product-info">
                        {status}
                    </div>
                );
            },
        },
        {
            key: 'total',
            title: t('table.total'),
            dataIndex: 'finalPrice',
            render: (value, record, index) => (
                <div key={index}>
                    <span style={{ color: '#ff424e' }}>{NumberWithCommas(value)}&nbsp;₫</span>
                </div>
            ),
        },
    ];
    const data = orderHistory;
    return (
        <div className={cx('profile__info')}>
            <div className={cx('profile__info-title')}>
                <h4 style={{ fontWeight: '700', fontSize: '20px' }}>Danh sách đơn hàng</h4>
            </div>
            <div style={{ border: '2px solid #f0f0f0' }}>
                <Table rowKey={item => item._id} columns={columns} dataSource={data} bordered />
            </div>
        </div>
    );
};

export default OrderPage;
