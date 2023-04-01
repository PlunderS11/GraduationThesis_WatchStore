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
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const getProductDetail = async () => {
            const res = await axiosClient.get(`product/detail/${params.slug}/3`);
            if (!_.isEmpty(res.data.detailProduct)) {
                setProduct(res.data.detailProduct.detail);
                setRelatedProducts(res.data.detailProduct.relatedProducts);
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
            dispatch(changeProgress(100));
        }
    }, [dispatch, params.slug, product]);

    const handleAddToCart = () => {
        dispatch(addToCart({ product, quantity: 1 }));
        toast.success(t('productDetail.addToCart'));
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
                                    ? `${NumberWithCommas(product.finalPrice)}đ`
                                    : t('productCard.outOfStock')}
                            </p>
                            <p className={cx('description')}>{product[`description${i18n.language}`]}</p>
                            <p className={cx('note')}>{product.note}</p>
                            {product.stock > 0 && (
                                <div className={cx('buy')}>
                                    <Button onclick={handleAddToCart}>{t('button.addToCart')}</Button>
                                    <Button onclick={handleAddToCart}>{t('button.buy')}</Button>
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
