import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import style from './Home.module.scss';
import { imagesSlide } from '../../assets/images';
import { images } from '../../assets/images';
import HomeSlideItem from '../../components/HomeSlideItem/HomeSlideItem';
import ProductByCategory from '../../components/ProductByCategory/ProductByCategory';
import Button from '../../components/Button/Button';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import ProductViewed from '../../components/ProductViewed/ProductViewed';

const cx = classNames.bind(style);

const sellingProducts = [
    {
        id: 39,
        type: 'wacth',
        sex: true,
        brand: 'Dyoss',
        size: 34,
        strap: 'metal',
        color: 'red',
        images: '["https://www.dyoss.com/app/uploads/2017/07/upweb_gocchinh12.jpg","https://www.dyoss.com/app/uploads/2017/09/upweb_gocnghieng_11.jpg","https://www.dyoss.com/app/uploads/2017/09/upweb_goc34_den.jpg","https://www.dyoss.com/app/uploads/2017/09/upweb_gocsau_den.jpg"]',
        link: 'gatsby-matte-mesh-36',
        name: 'Gatsby - Matte/Mesh/36',
        price: 3100000,
        stock: 0,
    },
    {
        id: 20,
        type: 'wacth',
        sex: true,
        brand: 'Dyoss',
        size: 34,
        strap: 'metal',
        color: 'red',
        images: '["https://www.dyoss.com/app/uploads/2019/06/02.jpg","https://www.dyoss.com/app/uploads/2019/06/06.jpg"]',
        link: 'mystique-rose-rose-mesh-34',
        name: 'Mystique - Rose/Rose Mesh/34',
        price: 3100000,
        stock: 72,
    },
    {
        id: 3,
        type: 'wacth',
        sex: true,
        brand: 'Dyoss',
        size: 34,
        strap: 'metal',
        color: 'red',
        images: '["https://www.dyoss.com/app/uploads/2017/07/upweb_gocchinh_15-1.jpg","https://www.dyoss.com/app/uploads/2017/07/upweb_gocnghieng_15-1.jpg","https://www.dyoss.com/app/uploads/2017/07/upweb_gocsau_13-1.jpg"]',
        link: 'iconic-black-brown-40',
        name: 'Iconic - Black/Brown/40',
        price: 2890000,
        stock: 0,
    },
];

const Home = () => {
    SwiperCore.use([Autoplay]);

    const { t } = useTranslation();
    return (
        <div className={cx('home')}>
            {/*Hero_slide*/}
            <div className={cx('slide')}>
                <Swiper
                    modules={[Autoplay]}
                    grabCursor={true}
                    spaceBetween={0}
                    slidesPerView={1}
                    autoplay={{ delay: 3000 }}
                >
                    {Object.values(imagesSlide).map((item, i) => (
                        <SwiperSlide key={i}>
                            {({ isActive }) => <HomeSlideItem item={item} className={cx(isActive ? 'active' : '')} />}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            {/*Hero Slide*/}

            {/* Selling */}
            <div className="selling">
                <div className={cx('container')}>
                    {sellingProducts.length > 0 && (
                        <ProductByCategory title={t('home.selling')} description={''} listProduct={sellingProducts} />
                    )}
                </div>
            </div>
            {/* Selling */}

            {/* Products Silde */}
            <div className={cx('sex-block')}>
                <div className={cx('category')}>
                    <img src={images.womenCategory} alt="Products" />
                    <h2>{t('home.womenWatches')}</h2>
                    <Button to={'/product-category/woman'}>{t('button.viewAll')}</Button>
                </div>
                <div className={cx('product-slider')}>
                    {sellingProducts.length > 0 && <ProductSlider listData={sellingProducts} navigation autoplay />}
                </div>
            </div>

            <div className={cx('about-block')}>
                <div className={cx('about-content')}>
                    <h2 className={cx('about-title')}>
                        {t('home.introduce')} <br /> {t('home.brandName')}
                    </h2>
                    <p className={cx('about-description')}>{t('home.description')}</p>
                    <div className={cx('about-feature')}>
                        <div className={cx('item')}>
                            <img src={images.feature1} alt="Chống trầy" />
                            <p>{t('home.scratchResistant')}</p>
                        </div>
                        <div className={cx('item')}>
                            <img src={images.feature2} alt="Chống nước" />
                            <p>{t('home.waterResistant')}</p>
                        </div>
                        <div className={cx('item')}>
                            <img src={images.feature3} alt="Máy nhật" />
                            <p>{t('home.miyotaMachine')}</p>
                        </div>
                    </div>
                    <Button to={'/about-us'}>{t('button.moreInfor')}</Button>
                </div>
                <div className={cx('photo')}>
                    <img src={images.aboutImage} alt="Product" />
                </div>
            </div>
            {/* Products Silde */}
            {/* Viewed Product */}
            <div className={cx('container')}>
                <ProductViewed />
            </div>
            {/* Viewed Product */}
        </div>
    );
};

export default Home;
