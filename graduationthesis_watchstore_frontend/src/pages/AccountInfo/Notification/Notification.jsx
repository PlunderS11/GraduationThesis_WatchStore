import React, { useEffect, useState } from 'react';

import style from './Notification.module.scss';
import axiosClient from '../../../api/axiosClient';
import NotiItem from './components/NotiItem';
import Button from '../../../components/Button/Button';
import { Spin } from 'antd';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(style);

const Notification = props => {
    const { t } = useTranslation();
    const [noti, setNoti] = useState([]);
    const [visibleUsers, setVisibleUsers] = useState(10);
    const [notiSeen, setNotiSeen] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAllNotification = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('notification');
            const lst = res.data.notifications;
            const lstSeen = lst.filter(item => item.isSeen === false).length;
            setNoti(lst);
            setNotiSeen(lstSeen);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getAllNotification();
    }, []);
    const handleLoadmore = () => {
        setVisibleUsers(prevVisibleUsers => prevVisibleUsers + 10);
    };

    return (
        <Spin spinning={loading}>
            <div className={cx('profile__info')}>
                <div className={cx('profile__info-title')}>
                    <h4 style={{ fontWeight: '700', fontSize: '20px' }}>{t('accountInfo.myNotification')}</h4>
                </div>
                <div style={{ border: '2px solid #f0f0f0', padding: '20px' }}>
                    <div className={cx('notification-header')}>
                        <div className={cx('notification-header-title')}>{`${t(
                            'accountInfo.notificationNew'
                        )} (${notiSeen})`}</div>
                        {/* <Button onclick={handleSeenAllNoti}>Đọc tất cả</Button> */}
                    </div>
                    {noti.slice(0, visibleUsers).map(item => (
                        <NotiItem key={item._id} seen={item?.isSeen} noti={item} />
                    ))}
                    {noti.length > visibleUsers && (
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

export default Notification;
