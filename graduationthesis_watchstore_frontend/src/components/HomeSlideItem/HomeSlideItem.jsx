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
                backgroundImage: `url(${props.item})`,
            }}
        >
            <div className={cx('content')}>
                <div className={cx('info')}>
                    <h2 className={cx('brand-name')}>{t('home.brandName')}</h2>
                    <div className={cx('slogun')}>{t('home.slogan')}</div>
                </div>
                <div className={cx('poster')}>
                    <img
                        src="https://www.dyoss.com/app/uploads/2018/08/upweb_gocnghieng12_rosegold-3-600x600.jpg"
                        alt="12"
                    />
                </div>
            </div>
        </div>
    );
};

export default HomeSlideItem;
