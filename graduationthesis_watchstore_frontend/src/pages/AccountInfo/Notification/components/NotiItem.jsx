import React from 'react';

import style from './NotiItem.module.scss';
import { Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { images } from '../../../../assets/images';
import axiosClient from '../../../../api/axiosClient';
import classNames from 'classnames/bind';
import moment from 'moment';

const cx = classNames.bind(style);

const NotiItem = ({ seen, noti }) => {
    const navigate = useNavigate();
    const handleSeen = async () => {
        try {
            await axiosClient.put(`notification/seen/${noti._id}`);
            navigate(`/account/order-history/${noti.order._id}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={cx('noti-item', seen ? '' : 'seen')}>
            <div className={cx('noti-item__content')}>
                <div className={cx('noti-item__content-title')}>
                    <div className={cx('noti-item__content-title-image')}>
                        <img src={images.logoBlack} alt="" />
                    </div>
                    <div className={cx('noti-item__content-title-text')}>
                        <div className={cx('noti-item__content-title-text-title')}>{noti.title}</div>
                        <div className={cx('noti-item__content-title-text-subtitle')}>{noti.content}</div>
                    </div>
                </div>
                <Divider style={{ margin: '10px 0', borderBlockStart: '3px solid rgba(5, 5, 5, 0.06)' }} />
                <div className={cx('noti-item__content-date')}>
                    <div className={cx('noti-item__content-date-content')}>
                        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 2.75a9.25 9.25 0 1 0 0 18.5 9.25 9.25 0 0 0 0-18.5zM1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12 17.937 22.75 12 22.75 1.25 17.937 1.25 12zM12 7.25a.75.75 0 0 1 .75.75v3.69l2.28 2.28a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1-.22-.53V8a.75.75 0 0 1 .75-.75z"
                                fill="#4C6769"
                            ></path>
                        </svg>
                        <div className={cx('noti-item__content-date-text')}>
                            {moment(noti.createdAt).format('DD/MM/YYYY')}
                        </div>
                    </div>
                    <div className={cx('noti-item__content-date-nav')} onClick={handleSeen}>
                        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M8.512 4.43a.75.75 0 0 1 1.057.082l6 7a.75.75 0 0 1 0 .976l-6 7a.75.75 0 1 1-1.138-.976L14.012 12 8.431 5.488a.75.75 0 0 1 .08-1.057z"
                                fill="#4C6769"
                            ></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotiItem;
