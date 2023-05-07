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
        // setNoti([...noti, ...all]);
    };
    return (
        <Spin spinning={loading}>
            <div className={cx('profile__info')}>
                <div className={cx('profile__info-title')}>
                    <h4 style={{ fontWeight: '700', fontSize: '20px' }}>{t('accountInfo.myVoucher')}</h4>
                </div>
                <div style={{ border: '2px solid #f0f0f0', padding: '10px' }}>
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab={t('accountInfo.noused')} key={1}>
                            <Card>
                                {promotionAvailable.map(item => (
                                    <Card.Grid className={cx('card')}>
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
                                                <Descriptions.Item label={t('accountInfo.startDate')}>
                                                    {item.startDate}
                                                </Descriptions.Item>
                                                <Descriptions.Item label={t('accountInfo.endDate')}>
                                                    {item.endDate}
                                                </Descriptions.Item>
                                                <Descriptions.Item label={t('accountInfo.value')}>
                                                    {item.value}%
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    </Card.Grid>
                                ))}
                            </Card>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={t('accountInfo.used')} key={2}>
                            <Card>
                                {promotionUsed?.map(item => (
                                    <Card.Grid className={cx('card')}>
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
                                                <Descriptions.Item label={t('accountInfo.startDate')}>
                                                    {item.startDate}
                                                </Descriptions.Item>
                                                <Descriptions.Item label={t('accountInfo.endDate')}>
                                                    {item.endDate}
                                                </Descriptions.Item>
                                                <Descriptions.Item label={t('accountInfo.value')}>
                                                    {item.value}%
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    </Card.Grid>
                                ))}
                            </Card>
                        </Tabs.TabPane>
                    </Tabs>
                    <div style={{ textAlign: 'center' }}>
                        <Button onclick={handleLoadmore}>{t('button.loadMore')}</Button>
                    </div>
                </div>
            </div>
        </Spin>
    );
};

export default Voucher;
