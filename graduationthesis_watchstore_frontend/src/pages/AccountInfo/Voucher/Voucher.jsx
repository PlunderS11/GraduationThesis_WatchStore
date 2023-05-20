import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import style from './Voucher.module.scss';
import { Card, Descriptions, Space, Spin, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../../api/axiosClient';
import Button from '../../../components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import i18n from '../../../i18n';

const cx = classNames.bind(style);

const Voucher = () => {
    const { t } = useTranslation();
    const [promotionAvailable, setPromotionAvailable] = useState([]);
    const [promotionUsed, setPromotionUsed] = useState([]);
    const [visibleVoucher, setVisibleVoucher] = useState(10);
    const [loading, setLoading] = useState(false);

    const getAllNotification = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('promotion/myPromotion');
            setPromotionAvailable(res.data.promotionAvailable);
            setPromotionUsed(res.data.promotionUsed);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getAllNotification();
    }, []);

    const handleLoadmore = () => {
        setVisibleVoucher(pre => pre + 10);
    };
    return (
        <Spin spinning={loading}>
            <div className={cx('profile__info')}>
                <div className={cx('profile__info-title')}>
                    <h4 style={{ fontWeight: '700', fontSize: '20px' }}>{t('accountInfo.myVoucher')}</h4>
                </div>
                <div style={{ border: '2px solid #f0f0f0', padding: '10px' }}>
                    <Tabs
                        defaultActiveKey="1"
                        items={[
                            {
                                key: 1,
                                label: <span>{t('accountInfo.noused')}</span>,
                                children: (
                                    <Card>
                                        {promotionAvailable.slice(0, visibleVoucher).map(item => (
                                            <Card.Grid key={item._id} className={cx('card')}>
                                                <Card
                                                    bordered={false}
                                                    title={
                                                        <Space style={{ fontSize: 20 }}>
                                                            <FontAwesomeIcon icon={faTicket} />
                                                            {item.code}
                                                        </Space>
                                                    }
                                                >
                                                    <Descriptions column={1} labelStyle={{ fontWeight: 600 }}>
                                                        <Descriptions.Item label={t('accountInfo.promotionName')}>
                                                            {item[`title${i18n.language}`]}
                                                        </Descriptions.Item>
                                                        {item.type === 'normal' ? (
                                                            <>
                                                                <Descriptions.Item label={t('accountInfo.startDate')}>
                                                                    {item.startDate}
                                                                </Descriptions.Item>
                                                                <Descriptions.Item label={t('accountInfo.endDate')}>
                                                                    {item.endDate}
                                                                </Descriptions.Item>
                                                            </>
                                                        ) : (
                                                            <Descriptions.Item label={t('accountInfo.endDate')}>
                                                                {t('accountInfo.forever')}
                                                            </Descriptions.Item>
                                                        )}
                                                        <Descriptions.Item label={t('accountInfo.value')}>
                                                            {item.value}%
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                </Card>
                                            </Card.Grid>
                                        ))}
                                    </Card>
                                ),
                            },
                            {
                                key: 2,
                                label: <span>{t('accountInfo.used')}</span>,
                                children: (
                                    <Card>
                                        {promotionUsed.slice(0, visibleVoucher).map(item => (
                                            <Card.Grid key={item._id} className={cx('card')}>
                                                <Card
                                                    bordered={false}
                                                    title={
                                                        <Space style={{ fontSize: 20 }}>
                                                            <FontAwesomeIcon icon={faTicket} />
                                                            {item.code}
                                                        </Space>
                                                    }
                                                >
                                                    <Descriptions column={1} labelStyle={{ fontWeight: 600 }}>
                                                        <Descriptions.Item label={t('accountInfo.promotionName')}>
                                                            {item[`title${i18n.language}`]}
                                                        </Descriptions.Item>
                                                        {item.type === 'normal' ? (
                                                            <>
                                                                <Descriptions.Item label={t('accountInfo.startDate')}>
                                                                    {item.startDate}
                                                                </Descriptions.Item>
                                                                <Descriptions.Item label={t('accountInfo.endDate')}>
                                                                    {item.endDate}
                                                                </Descriptions.Item>
                                                            </>
                                                        ) : (
                                                            <Descriptions.Item label={t('accountInfo.endDate')}>
                                                                {t('accountInfo.forever')}
                                                            </Descriptions.Item>
                                                        )}
                                                        <Descriptions.Item label={t('accountInfo.value')}>
                                                            {item.value}%
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                </Card>
                                            </Card.Grid>
                                        ))}
                                    </Card>
                                ),
                            },
                        ]}
                    />
                    {promotionAvailable.length > visibleVoucher && (
                        <div style={{ textAlign: 'center' }}>
                            <Button customClass={style} onclick={handleLoadmore}>
                                {t('button.loadMore')}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Spin>
    );
};

export default Voucher;
