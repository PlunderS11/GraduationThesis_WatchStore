import { useEffect, useState } from 'react';
import _, { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import classNames from 'classnames/bind';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import ProductByCategory from '../../components/ProductByCategory/ProductByCategory';
import Button from '../../components/Button/Button';
import { NumberWithCommas } from '../../functions';

import style from './ProductDetail.module.scss';

const cx = classNames.bind(style);

const pro = {
    id: 39,
    type: 'wacth',
    sex: true,
    brand: 'Dyoss',
    size: 34,
    strap: 'metal',
    color: 'black',
    images: [
        'https://www.dyoss.com/app/uploads/2017/07/upweb_gocchinh12.jpg',
        'https://www.dyoss.com/app/uploads/2017/09/upweb_gocnghieng_11.jpg',
        'https://www.dyoss.com/app/uploads/2017/09/upweb_goc34_den.jpg',
        'https://www.dyoss.com/app/uploads/2017/09/upweb_gocsau_den.jpg',
    ],
    link: 'gatsby-matte-mesh-36',
    name: 'Gatsby - Matte/Mesh/36',
    features: [
        'Đường kính 36mm - dành cho Nữ.',
        'Máy Quartz Miyota Nhật Bản.',
        'Mặt kính Sapphire chống trầy cao cấp.',
        'Chống nước 5ATM (có thể đeo khi bơi - không khuyến khích).',
        'Vỏ đồng hồ và khoá bằng thép không gỉ.',
        'Dây thép và dây da nhập khẩu - size 18mm.',
        'Bảo hành 1 năm cho máy và thay pin miễn phí.',
    ],
    description:
        'Sản phẩm vô cùng bắt mắt mới được “trình làng” của Dyoss là biểu trưng cho sự tinh giản, hiện đại vượt thời gian. Sự bóng bẩy trong thiết kế, cũng như nét lôi cuốn mà chiếc đồng hồ sở hữu sẽ làm bạn cảm thấy hài lòng khi có phụ kiện này yên vị trên cổ tay của mình.',
    price: 3100000,
    stock: 0,
};

const related = [
    {
        id: 39,
        type: 'wacth',
        sex: true,
        brand: 'Dyoss',
        size: 34,
        strap: 'metal',
        color: 'black',
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
        color: 'black',
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
        color: 'black',
        images: '["https://www.dyoss.com/app/uploads/2017/07/upweb_gocchinh_15-1.jpg","https://www.dyoss.com/app/uploads/2017/07/upweb_gocnghieng_15-1.jpg","https://www.dyoss.com/app/uploads/2017/07/upweb_gocsau_13-1.jpg"]',
        link: 'iconic-black-brown-40',
        name: 'Iconic - Black/Brown/40',
        price: 2890000,
        stock: 0,
    },
];

const ProductDetail = () => {
    const [product, setProduct] = useState(pro);
    const { t } = useTranslation();
    const [relatedProducts, setRelatedProducts] = useState([]);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // http.get(http.Dyoss, `product/detail/${params.slug}/4`).then(response => {
        //     if (!_.isEmpty(response)) {
        //         const prod = response.detail;
        //         prod.features = JSON.parse(prod.features);
        //         prod.images = JSON.parse(prod.images);
        //         setProduct(prod);
        //         setRelatedProducts(response.relatedProducts);
        //         dispatch(changeProgress(50));
        //     } else {
        //         navigate('/');
        //     }
        // });
        setProduct(product);
        setRelatedProducts(related);
    }, [params.slug, navigate]);

    const handleAddToCart = () => {
        // const optionExists = [];
        // for (const [key, value] of Object.entries(options)) {
        //     if (value.length > 0) {
        //         optionExists.push(key);
        //     }
        // }

        // const check = optionExists.every(r => Object.keys(optionSelected).indexOf(r) >= 0);

        // if (check) {
        //     dispatch(
        //         addToCart(product.id, product.name, product.price, product.link, product.images[0], optionSelected)
        //     );
        //     toast.success(t('productDetail.addToCart'), {
        //         position: toast.POSITION.BOTTOM_RIGHT,
        //         autoClose: 3000,
        //         closeOnClick: true,
        //     });
        // } else {
        //     toast.error(t('productDetail.chooseOption'), {
        //         position: toast.POSITION.BOTTOM_RIGHT,
        //         autoClose: 3000,
        //         closeOnClick: true,
        //     });
        // }
        alert('AddToCart');
    };

    return (
        <>
            {!isEmpty(product) && (
                <main className={cx('product-detail-page')}>
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
                                <p className={cx('description')}>{product.description}</p>
                                <p className={cx('note')}>{product.note}</p>
                                {/* <div className={cx('options')}>
                                    {!_.isEmpty(options) && options.watch.length > 0 && (
                                        <ProductOption
                                            title={'Chọn đồng hồ'}
                                            options={options.watch}
                                            type={'watch'}
                                            current={optionSelected.watch}
                                            onChose={handleChoseItem}
                                        />
                                    )}
                                    {!_.isEmpty(options) && options.strap.length > 0 && (
                                        <ProductOption
                                            title={'Chọn dây đeo'}
                                            options={options.strap}
                                            type={'strap'}
                                            current={optionSelected.strap}
                                            onChose={handleChoseItem}
                                        />
                                    )}
                                </div> */}
                                {product.stock > 0 && (
                                    <div className={cx('buy')}>
                                        <Button onClick={handleAddToCart}>{t('button.addToCart')}</Button>
                                        <Button onClick={handleAddToCart}>{t('button.buy')}</Button>
                                    </div>
                                )}
                                <ul className={cx('features')}>
                                    {product.features.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className={cx('product-related')}>
                            <ProductByCategory title={'Sản phẩm liên quan'} listProduct={relatedProducts} column={3} />
                        </div>
                    </div>
                </main>
            )}
        </>
    );
};

export default ProductDetail;
