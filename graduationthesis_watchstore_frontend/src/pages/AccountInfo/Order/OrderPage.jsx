import React, { useEffect, useState } from 'react';
import { Badge, Space, Spin, Tabs } from 'antd';
import classNames from 'classnames/bind';

import axiosClient from '../../../api/axiosClient';
import style from './Order.module.scss';
import { useTranslation } from 'react-i18next';
import { orderStatus } from '../../../assets/datas';
import OrderHistoryItem from './components/OrderHistoryItem';
import Button from '../../../components/Button/Button';

const cx = classNames.bind(style);

const OrderPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);
    const [status, setStatus] = useState('');
    const [visibleOrder, setVisibleOrder] = useState(10);
    const [summary, setSummary] = useState({});

    useEffect(() => {
        fetchOrderHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        const resSummary = await axiosClient.get('order/summary');
        setSummary(resSummary.data.summary);
    };
    const fetchOrderHistory = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('order/customer', { params: { status } });
            setOrderHistory(res.data.orders);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleLoadmore = () => {
        setVisibleOrder(prevVisibleOrder => prevVisibleOrder + 10);
    };

    return (
        <div className={cx('profile__info')}>
            <div className={cx('profile__info-title')}>
                <h4 style={{ fontWeight: '700', fontSize: '20px' }}>{t('accountInfo.listOrder')}</h4>
            </div>
            <div style={{ border: '2px solid #f0f0f0', padding: 10 }}>
                <Spin spinning={loading}>
                    <Tabs
                        onChange={e => {
                            setStatus(e);
                        }}
                        defaultActiveKey="1"
                        items={Object.keys(orderStatus).map(item => ({
                            key: `${orderStatus[item]}`,
                            label: (
                                <Space>
                                    <span>{t(`cart.status.${item}`)}</span>
                                    <Badge
                                        showZero
                                        overflowCount={99999}
                                        count={summary[item]}
                                        style={{
                                            backgroundColor: item.color,
                                        }}
                                    />
                                </Space>
                            ),
                            children: (
                                <div className={cx('list-order')}>
                                    {orderHistory.slice(0, visibleOrder).map(item => (
                                        <OrderHistoryItem key={item._id} orderHistory={item} />
                                    ))}
                                    {orderHistory.length > visibleOrder && (
                                        <div style={{ textAlign: 'center' }}>
                                            <Button customClass={style} onclick={handleLoadmore}>
                                                {t('button.loadMore')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ),
                        }))}
                    />
                </Spin>
            </div>
        </div>
    );
};

export default OrderPage;
