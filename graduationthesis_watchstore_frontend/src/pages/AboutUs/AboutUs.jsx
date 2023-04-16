import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import { images } from '../../assets/images';
import style from './AboutUs.module.scss';
import MyBreadcrumb from '../../components/Breadcrumb/MyBreadcrumb';

const cx = classNames.bind(style);

const AboutUs = () => {
    const { t } = useTranslation();

    return (
        <div className={cx('about-us')}>
            <div className={cx('container')}>
                <MyBreadcrumb />
                <div className={cx('inner')}>
                    <div className={cx('block')}>
                        <h2 className={cx('title')}>{t('aboutUs.introduce')}</h2>
                        <p>{t('aboutUs.introduceDescription')}</p>
                        <img
                            src="https://www.dyoss.com/app/uploads/2017/07/dyoss-high.gif"
                            alt="anti water"
                            className={cx('image')}
                        />
                        <h2 className={cx('title')}>{t('aboutUs.highlights')}</h2>
                        <p>{t('aboutUs.highlightsDescription')}</p>
                    </div>
                    <div className={cx('block')}>
                        <img src={images.feature1} alt="Chống trầy" className={cx('icon')} />
                        <h2 className={cx('title')}>{t('aboutUs.scratchResistant')}</h2>
                        <p>{t('aboutUs.scratchResistantDescription')}</p>
                    </div>
                    <div className={cx('block')}>
                        <img src={images.feature2} alt="Chống nước" className={cx('icon')} />
                        <h2 className={cx('title')}>{t('aboutUs.waterResistant')}</h2>
                        <p>{t('aboutUs.waterResistantDescription')}</p>
                    </div>
                    <div className={cx('block')}>
                        <img src={images.feature3} alt="Máy nhật" className={cx('icon')} />
                        <h2 className={cx('title')}>{t('aboutUs.machine')}</h2>
                        <p>{t('aboutUs.machineDescription')}</p>
                    </div>
                    <div className={cx('block')}>
                        <h2 className={cx('title')}>{t('aboutUs.trend')}</h2>
                        <p>{t('aboutUs.trendDescription')}</p>
                        <img
                            src="https://www.dyoss.com/app/uploads/2017/05/About_couple1240x744.jpg"
                            alt="Bắt kịp xu hướng"
                            className={cx('image')}
                        />
                        <p>{t('aboutUs.finish')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
