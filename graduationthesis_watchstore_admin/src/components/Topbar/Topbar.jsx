import React from 'react';
import classNames from 'classnames/bind';

import styles from './Topbar.module.scss';
import logo from '~/assets/images/logo-white-removebg-preview.png';

const cx = classNames.bind(styles);

export default function Topbar() {
    return (
        <div className={cx('topbar')}>
            <div className={cx('topbar-wrapper')}>
                <div className={cx('top-left')}>
                    <img className={cx('logo-img')} src={logo} alt="" />
                    <span className={cx('logo')}>MYNHBAKE WATCH STORE</span>
                </div>
                <div className={cx('top-right')}>
                    {/* <img
                        src="https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                        alt=""
                        className={cx('top-avatar')}
                    /> */}
                </div>
            </div>
        </div>
    );
}
