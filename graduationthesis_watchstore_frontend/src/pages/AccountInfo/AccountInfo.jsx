import React from 'react';
import classNames from 'classnames/bind';
import { Col, Row } from 'antd';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import style from './AccountInfo.module.scss';
import { accountOptions } from '../../assets/datas/index';
import Profile from './Profile/Profile';
import Address from './Address/Address';
import OrderPage from './Order/OrderPage';
import MyBreadcrumb from '../../components/Breadcrumb/MyBreadcrumb';
import Notification from './Notification/Notification';
import Voucher from './Voucher/Voucher';

const cx = classNames.bind(style);

const AccountInfo = () => {
    const { t } = useTranslation();
    const params = useParams();
    const { pathname } = useLocation();

    return (
        <div className={cx('accountInfo-page')}>
            <div className="content">
                <div className="container">
                    <MyBreadcrumb urlParams={t(`breadcrumbs.${params.category}`)} detail />
                    <Row>
                        <Col span={6}>
                            <div className={cx('menu')}>
                                <div className={cx('menu-nav')}>
                                    <div className={cx('menu-title')}>
                                        <h4>Menu</h4>
                                    </div>
                                    <ul className={cx('menu-list')}>
                                        {accountOptions.map((item, i) => (
                                            <li
                                                key={i}
                                                className={cx('menu-list-item', { focus: item.path === pathname })}
                                            >
                                                <Link to={item.path}>{t(`header.userOption.${item.name}`)}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Col>
                        <Col span={18}>
                            {params.category === 'profile' && <Profile />}
                            {params.category === 'orders' && <OrderPage />}
                            {params.category === 'notification' && <Notification />}
                            {params.category === 'address' && <Address />}
                            {params.category === 'voucher' && <Voucher />}
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default AccountInfo;
