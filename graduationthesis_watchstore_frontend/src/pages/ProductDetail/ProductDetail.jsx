import { useEffect, useState } from 'react';
import _, { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import classNames from 'classnames/bind';

import axiosClient from '../../api/axiosClient';
import { changeProgress } from '../../features/loader';
import { addToCart } from '../../features/cart';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import ProductByCategory from '../../components/ProductByCategory/ProductByCategory';
import Button from '../../components/Button/Button';
import ProductOption from '../../components/ProductOption/ProductOption';
import { NumberWithCommas } from '../../functions';
import i18n from '../../i18n';

import style from './ProductDetail.module.scss';

const cx = classNames.bind(style);

const ProductDetail = () => {
    const { t } = useTranslation();
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [product, setProduct] = useState({});
    const [options, setOptions] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [optionSelected, setOptionSelected] = useState({});

    useEffect(() => {
        const getProductDetail = async () => {
            const res = await axiosClient.get(`product/detail/${params.slug}/3`);
            if (!_.isEmpty(res)) {
                const prod = res.detail;
                prod.images = JSON.parse(prod.images);
                setProduct(prod);
                setRelatedProducts(res.relatedProducts);
                dispatch(changeProgress(80));
            } else {
                navigate('/');
            }
        };
        getProductDetail();
    }, [params.slug, navigate, dispatch]);

    useEffect(() => {
        if (!isEmpty(product)) {
            // save into sessionStorage
            let items = sessionStorage.getItem('productsViewed') || ''; //string
            if (items) {
                const ids = items.split(','); //array
                if (!ids.includes(product._id.toString())) {
                    if (ids.length > 2) {
                        ids.shift();
                    }
                    ids.push(product._id);
                } else {
                    const index = ids.indexOf(product._id.toString());
                    ids.splice(index, 1);
                    ids.push(product._id);
                }
                items = ids.join(',');
            } else {
                items += product._id;
            }
            sessionStorage.setItem('productsViewed', items);
            // get the box options
            const getTheBoxOptions = async () => {
                const res = await axiosClient.get(`product/options/${params.slug}`);
                setOptions(res);
            };
            if (product.type === 'box') {
                getTheBoxOptions();
                dispatch(changeProgress(90));
            } else {
                dispatch(changeProgress(90));
            }
            dispatch(changeProgress(100));
        }
    }, [dispatch, params.slug, product]);

    const handleChoseItem = (type, item) => {
        setOptionSelected({ ...optionSelected, [type]: item });
    };

    const handleAddToCart = () => {
        const optionExists = [];
        for (const [key, value] of Object.entries(options)) {
            if (value.length > 0) {
                optionExists.push(key);
            }
        }
        const check = optionExists.every(r => Object.keys(optionSelected).indexOf(r) >= 0);

        if (check) {
            dispatch(
                addToCart(product._id, product.name, product.price, product.link, product.images[0], optionSelected)
            );
            toast.success(t('productDetail.addToCart'));
        } else {
            toast.error(t('productDetail.chooseOption'));
        }
    };
    return (
        <div className={cx('product-detail-page')}>
            {!isEmpty(product) && (
                <div className={cx('container')}>
                    <div className={cx('product-detail')}>
                        <div className={cx('image-detail')}>
                            {product.images.length > 0 && (
                                <ProductSlider listData={product.images} image customClass={style} autoplay />
                            )}
                        </div>
                        <div className={cx('content-detail')}>
                            <h1 className={cx('name')}>{product.name}</h1>
                            <p className={cx('price')}>
                                {product.stock > 0
                                    ? `${NumberWithCommas(product.price)}đ`
                                    : t('productCard.outOfStock')}
                            </p>
                            <p className={cx('description')}>{product[`description${i18n.language}`]}</p>
                            <p className={cx('note')}>{product.note}</p>
                            <div className={cx('options')}>
                                {!_.isEmpty(options) && options.watchs.length > 0 && (
                                    <ProductOption
                                        title={t('productDetail.titleOptionWatch')}
                                        options={options.watchs}
                                        type={'watchs'}
                                        current={optionSelected.watchs}
                                        onChose={handleChoseItem}
                                    />
                                )}
                                {!_.isEmpty(options) && options.straps.length > 0 && (
                                    <ProductOption
                                        title={t('productDetail.titleOptionStrap')}
                                        options={options.straps}
                                        type={'straps'}
                                        current={optionSelected.straps}
                                        onChose={handleChoseItem}
                                    />
                                )}
                            </div>
                            {product.stock > 0 && (
                                <div className={cx('buy')}>
                                    <Button onClick={handleAddToCart}>{t('button.addToCart')}</Button>
                                    <Button onClick={handleAddToCart}>{t('button.buy')}</Button>
                                </div>
                            )}
                            <ul className={cx('features')}>
                                {product[`features${i18n.language}`].map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className={cx('product-related')}>
                        <ProductByCategory title={'Sản phẩm liên quan'} listProduct={relatedProducts} column={3} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
