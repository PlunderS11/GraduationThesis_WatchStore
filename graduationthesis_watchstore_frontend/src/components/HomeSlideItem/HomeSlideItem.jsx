import React from 'react';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import style from './HomeSlideItem.module.scss';

const cx = classNames.bind(style);

const HomeSlideItem = props => {
    const { t } = useTranslation();
    return (
        <div
            className={cx('item', { [props.className]: props.className })}
            style={{
                backgroundImage: `url(${props.item.backGround})`,
            }}
        >
            <div className={cx('content')}>
                <div className={cx('info')}>
                    <h2 className={cx('brand-name')}>{t('home.brandName')}</h2>
                    <div className={cx('slogun')}>{t('home.slogan')}</div>
                </div>
                <div className={cx('poster')}>
                    <div className={cx('image')} style={{ backgroundImage: `url(${props.item.image})` }} />
                </div>
            </div>
        </div>
    );
};

export default HomeSlideItem;
