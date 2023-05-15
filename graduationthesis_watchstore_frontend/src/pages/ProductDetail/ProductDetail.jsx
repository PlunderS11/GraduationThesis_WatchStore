import { useEffect, useState } from 'react';
import _, { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import MyBreadcrumb from '../../components/Breadcrumb/MyBreadcrumb';
import { Spin } from 'antd';

const cx = classNames.bind(style);

const ProductDetail = () => {
    const { t } = useTranslation();
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(state => state.user);
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const getProductDetail = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get(`product/detail/${params.slug}/3`);
                if (!_.isEmpty(res.data.detailProduct)) {
                    setProduct(res.data.detailProduct.detail);
                    setRelatedProducts(res.data.detailProduct.relatedProducts);
                    dispatch(changeProgress(80));
                } else {
                    navigate('/');
                }
            } catch (error) {
            } finally {
                setLoading(false);
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

    const handleBuyNow = () => {
        if (user.isLogin) {
            dispatch(addToCart({ product, quantity: 1 }));
            toast.success(t('productDetail.addToCart'));
            navigate('/checkout');
        } else {
            toast.info(t('productDetail.buynowFail'));
            navigate('/login');
        }
    };
    return (
        <Spin spinning={loading}>
            <div className={cx('product-detail-page')}>
                {!isEmpty(product) && (
                    <div className={cx('container')}>
                        <MyBreadcrumb urlParams={product?.name} detail />
                        <div className={cx('product-detail')}>
                            <div className={cx('image-detail')}>
                                {product.images.length > 0 && (
                                    <ProductSlider listData={product?.images} image customClass={style} autoplay />
                                )}
                            </div>
                            <div className={cx('content-detail')}>
                                <h1 className={cx('name')}>{product?.name}</h1>
                                <p className={cx('price')}>
                                    {product.stock > 0
                                        ? `${NumberWithCommas(product?.finalPrice)}đ`
                                        : t('productCard.outOfStock')}
                                </p>
                                <p className={cx('description')}>{product?.[`description${i18n.language}`]}</p>
                                <p className={cx('note')}>{product?.note}</p>
                                {product.stock > 0 && (
                                    <div className={cx('buy')}>
                                        <Button customClass={style} onclick={handleAddToCart}>
                                            {t('button.addToCart')}
                                        </Button>
                                        <Button customClass={style} onclick={handleBuyNow}>
                                            {t('button.buy')}
                                        </Button>
                                    </div>
                                )}
                                <ul className={cx('features')}>
                                    {product[`features${i18n.language}`]?.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className={cx('product-related')}>
                            <ProductByCategory
                                title={t('gallery.headingProducts')}
                                listProduct={relatedProducts}
                                column={3}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Spin>
    );
};

export default ProductDetail;
