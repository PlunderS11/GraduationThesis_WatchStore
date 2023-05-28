import React, { useMemo } from 'react';
import classNames from 'classnames/bind';
import { RightOutlined } from '@ant-design/icons';
import { Divider, Image } from 'antd';

import style from './OrderHistoryItem.module.scss';
import { NumberWithCommas } from '../../../../functions';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(style);

const OrderHistoryItem = ({ orderHistory }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const status = useMemo(() => {
        var status = '';
        if (orderHistory.status.state === 'PENDING') {
            status = t('cart.status.pending');
        } else if (orderHistory.status.state === 'PACKAGE') {
            status = t('cart.status.package');
        } else if (orderHistory.status.state === 'DELIVERING') {
            status = t('cart.status.delivering');
        } else if (orderHistory.status.state === 'COMPLETE') {
            status = t('cart.status.complete');
        } else {
            status = t('cart.status.cancel');
        }
        return status;
    }, [orderHistory, t]);
    return (
        <div className={cx('bg')}>
            <div className={cx('id')}>
                <div className={cx('id__code')}>
                    <div className={cx('id__code-icon')}></div>
                    <span>{orderHistory.code}</span>
                </div>
                <div className={cx('id__price')}>{NumberWithCommas(orderHistory.finalPrice)}đ</div>
            </div>
            <Divider style={{ marginTop: 14, marginBottom: 12 }} />
            <div className={cx('product')}>
                <div className={cx('product__thumbnail')}>
                    <Image width={64} src={orderHistory.orderDetails[0].product.images[0]} fallback="" />
                </div>
                <div className={cx('product__text')}>
                    <div className={cx('product__text-name')}>{orderHistory.orderDetails[0].product.name}</div>
                    <div className={cx('product__text-content')}>
                        <div className={cx('product__text-price')}>
                            {NumberWithCommas(orderHistory.orderDetails[0].finalPrice)}đ
                        </div>
                        <div className={cx('product__text-quantity')}>x{orderHistory.orderDetails[0].quantity}</div>
                    </div>
                </div>
            </div>
            {orderHistory.orderDetails.length > 1 && (
                <div className={cx('more')}>
                    <Trans i18nKey="checkout.orderMoreProduct">
                        {{ quantity: orderHistory.orderDetails.length - 1 }}
                    </Trans>
                </div>
            )}
            <Divider style={{ marginTop: 12, marginBottom: 12 }} />
            <div className={cx('cta')}>
                <div className={cx('cta__leadtime')}>
                    <p>{t('checkout.orderStatus')}:</p>
                    <span>{status}</span>
                </div>
                <div
                    className={cx('cta__btn')}
                    onClick={() => navigate(`/account/order-history/${orderHistory._id}`, { state: { orderHistory } })}
                >
                    <RightOutlined />
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryItem;
