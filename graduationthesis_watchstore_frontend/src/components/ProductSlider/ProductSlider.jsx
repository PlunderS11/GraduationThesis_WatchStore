import classNames from 'classnames/bind';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Autoplay, Navigation, Thumbs } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import ProductCard from '../ProductCard/ProductCard';
import style from './ProductSlider.module.scss';
import { Image } from 'antd';

const cx = classNames.bind(style);

function ProductSlider({ listData, navigation = false, autoplay = false, image = false, customClass }) {
    const { t } = useTranslation();
    const btnPrevRef = useRef(null);
    const btnNextRef = useRef(null);

    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className={cx('slider')}>
            {/* Button custom */}
            {navigation && (
                <div className={cx('btn-controls')}>
                    <button className={cx('btn-prev')} ref={btnPrevRef}>
                        {t('slider.previous')}
                    </button>
                    <button className={cx('btn-next')} ref={btnNextRef}>
                        {t('slider.next')}
                    </button>
                </div>
            )}

            {/* Main slide */}
            <Swiper
                modules={[Navigation, Autoplay, Thumbs]}
                loop={true}
                className={cx('slides', customClass?.['slides'])}
                spaceBetween={12}
                speed={2000}
                tag="div"
                wrapperTag="ul"
                autoplay={
                    autoplay
                        ? {
                              delay: 3000,
                              disableOnInteraction: false,
                              pauseOnMouseEnter: true,
                          }
                        : false
                }
                navigation={
                    navigation
                        ? {
                              prevEl: btnPrevRef.current,
                              nextEl: btnNextRef.current,
                          }
                        : false
                }
                thumbs={
                    image
                        ? {
                              swiper: thumbsSwiper,
                              //   slideThumbActiveClass: cx('thumbs-active'),
                          }
                        : false
                }
                onBeforeInit={swiper => {
                    swiper.params.navigation.prevEl = btnPrevRef.current;
                    swiper.params.navigation.nextEl = btnNextRef.current;
                }}
            >
                {listData.map((item, index) => (
                    <SwiperSlide key={index} className={cx('slide')} tag="li">
                        {image ? (
                            <div className={cx('image-card')}>
                                <Image src={item} />
                            </div>
                        ) : (
                            <ProductCard product={item} customClass={style} />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbs */}
            {image && (
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={3}
                    watchSlidesProgress={true}
                    modules={[Thumbs]}
                    className={cx('slides-thumbs')}
                >
                    {listData.map((item, index) => (
                        <SwiperSlide key={index} className={cx('slide-thumb')} tag="li">
                            <img src={item} alt={`Product ${index}`} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}

export default ProductSlider;
