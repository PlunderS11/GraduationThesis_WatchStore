import React, { useEffect, useState } from 'react';

import style from './Notification.module.scss';
import axiosClient from '../../../api/axiosClient';
import NotiItem from './components/NotiItem/NotiItem';
import Button from '../../../components/Button/Button';
import { Spin } from 'antd';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(style);

const Notification = props => {
    const { t } = useTranslation();
    const [noti, setNoti] = useState([]);
    const [all, setAll] = useState();
    const [notiSeen, setNotiSeen] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAllNotification = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('notification');
            const lst = res.data.notifications;
            const lstSeen = lst.filter(item => item.isSeen === false).length;
            setAll(lst);
            setNoti(lst.slice(0, 5));
            setNotiSeen(lstSeen);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getAllNotification();
    }, []);

    // const handleSeenAllNoti = async () => {
    //     try {
    //         await axiosClient.put('notification/seenAll');
    //         getAllNotification();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const handleLoadmore = () => {
        setNoti([...noti, ...all]);
    };

    return (
        <Spin spinning={loading}>
            <div className={cx('profile__info')}>
                <div className={cx('profile__info-title')}>
                    <h4 style={{ fontWeight: '700', fontSize: '20px' }}>Thông báo của tôi</h4>
                </div>
                <div style={{ border: '2px solid #f0f0f0', padding: '20px' }}>
                    <div className={cx('notification-header')}>
                        <div className={cx('notification-header-title')}>{`Thông báo mới (${notiSeen})`}</div>
                        {/* <Button onclick={handleSeenAllNoti}>Đọc tất cả</Button> */}
                    </div>
                    {noti.map(item => (
                        <NotiItem key={item._id} seen={item?.isSeen} noti={item} />
                    ))}
                    <div style={{ textAlign: 'center' }}>
                        <Button onclick={handleLoadmore}>{t('button.loadMore')}</Button>
                    </div>
                </div>
            </div>
        </Spin>
    );
};

export default Notification;
