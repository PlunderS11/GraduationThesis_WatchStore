import classNames from 'classnames/bind';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faCartPlus, faChevronLeft, faChevronRight, faEye, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import i18n from '../../i18n';
import { Card, Image } from 'antd';

import { addToCart } from '../../features/cart';
import { galleryFetchImageInstagram, galleryFetchProducts } from '../../features/gallery';
import * as func from '../../functions';
import style from './Gallery.module.scss';
import { toast } from 'react-toastify';
import MyBreadcrumb from '../../components/Breadcrumb/MyBreadcrumb';

const cx = classNames.bind(style);

const Gallery = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const popup = useRef();

    const [showDetail, setShowDetail] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slugArray, setSlugArray] = useState([]);

    const isImagesFetch = useSelector(state => state.gallery.instagramImages.status);
    const listImages = useSelector(state => state.gallery.instagramImages.listImage);
    const isFetched = useSelector(state =>
        state.gallery.fetchStatus.find(item => item.id === listImages[currentIndex]?.id) ? true : false
    );
    const fetchStatus = useSelector(state =>
        state.gallery.fetchStatus.find(item => item.id === listImages[currentIndex]?.id)
    );

    const allProduct = useSelector(state => state.gallery.products);
    const products = useSelector(state => state.gallery.products.filter(item => slugArray.includes(item._id)));

    useEffect(() => {
        if (isImagesFetch === 'idle') {
            dispatch(galleryFetchImageInstagram());
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (showDetail) {
            const slugFromCaption = func.GetProductSlugsFromCaption(listImages[currentIndex].caption) || [];
            const slugs = slugFromCaption.map(item => item.replace('/product/', ''));
            setSlugArray(slugs);
            const notExistsSlug = slugs.filter(item => !allProduct.map(i => i._id).includes(item));
            if (!isFetched && notExistsSlug.length > 0) {
                const notExistsSlugString = notExistsSlug.join(',');
                dispatch(
                    galleryFetchProducts({
                        id: listImages[currentIndex].id,
                        slugString: notExistsSlugString,
                    })
                );
            }
            //To remove scrollbar when show popup
            document.body.style.overflow = 'hidden';
            //Focus main tag to listen event keydown
            popup.current.focus();
        } else {
            document.body.style.overflow = 'unset';
            popup.current.blur();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, showDetail]);

    //Handle when click image
    const handleImageClick = index => {
        //Show detail popup
        setShowDetail(true);
        //Set current image
        setCurrentIndex(index);
    };

    //Change image by navigation button
    const handleNavigateButtonClick = btn => {
        const listImagesLength = listImages.length;
        let nextViewIndex;

        if (btn === 'next') {
            nextViewIndex = (currentIndex + 1) % listImagesLength;
        } else {
            nextViewIndex = (currentIndex - 1 + listImagesLength) % listImagesLength;
        }
        setCurrentIndex(nextViewIndex);
    };

    const handleKeyDown = e => {
        switch (e.code) {
            case 'Escape':
                setShowDetail(false);
                break;
            case 'ArrowRight':
                handleNavigateButtonClick('next');
                break;
            case 'ArrowLeft':
                handleNavigateButtonClick('prev');
                break;
            case 'Tab':
                e.preventDefault();
                break;
            default:
        }
    };

    const handleAddToCart = item => {
        dispatch(addToCart({ product: item, quantity: 1 }));
        toast.success(t('productDetail.addToCart'));
    };

    return (
        <div className={cx('gallery-page')} ref={popup} tabIndex={1} onKeyDown={e => handleKeyDown(e)}>
            <div className="container">
                <MyBreadcrumb />
            </div>
            {listImages.length > 0 && (
                <ul className={cx('images')}>
                    {listImages.map((item, index) => (
                        <li className={cx('image')} key={item.id} onClick={() => handleImageClick(index)}>
                            <img src={item.media_url} alt={item.caption} />
                            <div className={cx('view')}>
                                <FontAwesomeIcon icon={faInstagram} className={cx('icon')} />
                                <p>{t('button.viewDetail')}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {/* Modal */}
            {showDetail && (
                <div className={cx('detail-popup')}>
                    <div className={cx('overlay')} onClick={() => setShowDetail(false)}></div>
                    <div className={cx('popup-container')}>
                        <div className={cx('detail-image')}>
                            <img
                                src={listImages[currentIndex].media_url}
                                alt={func.GetTitleFromCaption(listImages[currentIndex].caption)}
                            />
                        </div>
                        <div className={cx('detail-content')}>
                            <a
                                href={listImages[currentIndex].permalink}
                                target="_blank"
                                rel="noreferrer"
                            >{`instagram || ${func.ConvertToDateString(
                                listImages[currentIndex].timestamp,
                                i18n.language === 'vi' ? 'vi-VN' : 'en-EN'
                            )}`}</a>
                            <p className={cx('title')}>{func.GetTitleFromCaption(listImages[currentIndex].caption)}</p>
                            <ul className={cx('hashtags')}>
                                {func.GetTagsFromCaption(listImages[currentIndex].caption).map((tag, index) => (
                                    <li className={cx('tag')} key={index}>
                                        <a
                                            href={`https://www.instagram.com/explore/tags/${tag}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {tag}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            {products.length > 0 && (
                                <div className={cx('products-in-image')}>
                                    <h2 className={cx('title')}>{t('gallery.headingProducts')}</h2>
                                    <Card>
                                        {products.map(item => (
                                            <Card.Grid className={cx('product')} key={item._id}>
                                                <div className={cx('product-image')}>
                                                    {/* <img src={item.images[0]} alt={item.name} /> */}
                                                    <Image
                                                        width={'100%'}
                                                        height={'100%'}
                                                        preview={false}
                                                        src={item.images[0]}
                                                        style={{
                                                            cursor: 'pointer',
                                                            objectFit: 'contain',
                                                        }}
                                                    />
                                                </div>
                                                <div className={cx('buttons')}>
                                                    <Link to={`/product/${item._id}`} className={cx('view-detail')}>
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </Link>
                                                    <div
                                                        className={cx('add-to-cart')}
                                                        onClick={() => handleAddToCart(item)}
                                                    >
                                                        <FontAwesomeIcon icon={faCartPlus} />
                                                    </div>
                                                </div>
                                                <div className={cx('product-content')}>
                                                    <h3 className={cx('name')}>{item.name}</h3>
                                                    <p className={cx('price')}>
                                                        {func.NumberWithCommas(item.finalPrice)}đ
                                                    </p>
                                                </div>
                                            </Card.Grid>
                                        ))}
                                    </Card>
                                    {/* <ul className={cx('products')}>
                                        {products.map(item => (
                                            <li className={cx('product')} key={item._id}>
                                                <div className={cx('product-image')}>
                                                    <img src={item.images[0]} alt={item.name} />
                                                    <div className={cx('buttons')}>
                                                        <Link
                                                            to={`/product/${item.link}`}
                                                            className={cx('view-detail')}
                                                        >
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </Link>
                                                        <div
                                                            className={cx('add-to-cart')}
                                                            onClick={() => handleAddToCart(item)}
                                                        >
                                                            <FontAwesomeIcon icon={faCartPlus} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={cx('product-content')}>
                                                    <h3 className={cx('name')}>{item.name}</h3>
                                                    <p className={cx('price')}>
                                                        {func.NumberWithCommas(item.finalPrice)}đ
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul> */}
                                </div>
                            )}
                            {fetchStatus?.status === 'loading' && (
                                <div className={cx('loader')}>
                                    <PulseLoader color={'#000'} />
                                </div>
                            )}
                        </div>
                        <div className={cx('close-btn')} onClick={() => setShowDetail(false)}>
                            <FontAwesomeIcon icon={faXmark} />
                        </div>
                        <div className={cx('navigate-btn')}>
                            <div className={cx('prev', 'btn')} onClick={() => handleNavigateButtonClick('prev')}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </div>
                            <div className={cx('next', 'btn')} onClick={() => handleNavigateButtonClick('next')}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
