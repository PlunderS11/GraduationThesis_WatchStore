import { Autoplay } from 'swiper';
import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { imagesSlide } from '../../assets/images';
import { images } from '../../assets/images';
import HomeSlideItem from '../../components/HomeSlideItem/HomeSlideItem';
import ProductByCategory from '../../components/ProductByCategory/ProductByCategory';
import Button from '../../components/Button/Button';
import { changeProgress } from '../../features/loader';
import { fetchProducts } from '../../features/products';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import ProductViewed from '../../components/ProductViewed/ProductViewed';
import style from './Home.module.scss';

const cx = classNames.bind(style);

const Home = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const productStatus = useSelector(state => state.products.status);
    const sellingProducts = useSelector(state => state.products.sellingProducts);
    const manProducts = useSelector(state => state.products.manProducts);
    const womanProducts = useSelector(state => state.products.womanProducts);

    useEffect(() => {
        if (productStatus === 'idle') {
            dispatch(changeProgress(98));
            dispatch(fetchProducts());
        }
        if (productStatus === 'succeeded') {
            dispatch(changeProgress(100));
        }
    }, [productStatus, dispatch]);
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
                    speed={1500}
                    loop={true}
                >
                    {imagesSlide.map((item, i) => (
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
                        <ProductByCategory
                            title={t('home.selling')}
                            listProduct={window.innerWidth < 450 ? sellingProducts : [...sellingProducts].slice(0, -1)}
                        />
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
                    {womanProducts.length > 0 && <ProductSlider listData={womanProducts} navigation autoplay />}
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
            <div className={cx('sex-block')}>
                <div className={cx('category')}>
                    <img src={images.menCategory} alt="Products" />
                    <h2>{t('home.menWatches')}</h2>
                    <Button to={'/product-category/man'}>{t('button.viewAll')}</Button>
                </div>
                <div className={cx('product-slider')}>
                    {manProducts.length > 0 && <ProductSlider listData={manProducts} navigation autoplay />}
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
