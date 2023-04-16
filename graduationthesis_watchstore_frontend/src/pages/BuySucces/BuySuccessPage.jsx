import React from 'react';
import Button from '../../components/Button/Button';

import style from './BuySuccessPage.module.scss';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import MyBreadcrumb from '../../components/Breadcrumb/MyBreadcrumb';
const cx = classNames.bind(style);

const BuySuccessPage = () => {
    const { t } = useTranslation();
    return (
        <div className={cx('buy-success-page')}>
            <div className={cx('container')}>
                <MyBreadcrumb />
                <div className={cx('body')}>
                    <div className={cx('body-header-noti')}>
                        <div className={cx('header-noti-icon')}>
                            <svg width="24" height="24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7.099 1.25H16.9c1.017 0 1.717 0 2.306.204a3.796 3.796 0 0 1 2.348 2.412l-.713.233.713-.234c.196.598.195 1.307.195 2.361v14.148c0 1.465-1.727 2.338-2.864 1.297a.196.196 0 0 0-.272 0l-.483.442c-.928.85-2.334.85-3.262 0a.907.907 0 0 0-1.238 0c-.928.85-2.334.85-3.262 0a.907.907 0 0 0-1.238 0c-.928.85-2.334.85-3.262 0l-.483-.442a.196.196 0 0 0-.272 0c-1.137 1.04-2.864.168-2.864-1.297V6.226c0-1.054 0-1.763.195-2.36a3.796 3.796 0 0 1 2.348-2.412c.59-.205 1.289-.204 2.306-.204zm.146 1.5c-1.221 0-1.642.01-1.96.121-.659.23-1.186.766-1.415 1.462-.11.339-.12.785-.12 2.037v14.004c0 .12.06.192.135.227a.2.2 0 0 0 .11.018.194.194 0 0 0 .107-.055 1.696 1.696 0 0 1 2.296 0l.483.442a.907.907 0 0 0 1.238 0 2.407 2.407 0 0 1 3.262 0 .907.907 0 0 0 1.238 0 2.407 2.407 0 0 1 3.262 0 .907.907 0 0 0 1.238 0l.483-.442a1.696 1.696 0 0 1 2.296 0c.043.04.08.052.108.055.031.005.07 0 .109-.018.075-.035.135-.108.135-.227V6.37c0-1.252-.01-1.698-.12-2.037a2.296 2.296 0 0 0-1.416-1.462c-.317-.11-.738-.121-1.96-.121H7.246zm7.754 4.69a.75.75 0 0 1 .06 1.06l-3.571 4a.75.75 0 0 1-1.119 0L8.94 10.9a.75.75 0 1 1 1.12-1l.868.974L13.94 7.5A.75.75 0 0 1 15 7.44zM6.75 15.5a.75.75 0 0 1 .751-.75h9a.75.75 0 1 1 0 1.5h-9a.75.75 0 0 1-.75-.75z"
                                    fill="#fff"
                                ></path>
                            </svg>
                        </div>
                        <div className={cx('header-noti-text')}>{t('checkout.buySuccess')}</div>
                    </div>
                    <div className={cx('body-header-text')}>
                        <Button customClass={style} to="/account/orders">
                            {t('button.gotoOrderHistory')}
                        </Button>
                        <Button customClass={style} to="/">
                            {t('button.goHome')}!
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuySuccessPage;
