import classNames from 'classnames/bind';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ProductByCategory from '../ProductByCategory/ProductByCategory';
import style from './ProductViewed.module.scss';

const cx = classNames.bind(style);

const products = [
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

function ProductViewed() {
    const { t } = useTranslation();
    // const [products, setProducts] = useState([]);

    // useEffect(() => {
    //     const productViewd = sessionStorage.getItem('productViewed');

    //     if (productViewd) {
    //         http.get(http.Dyoss, `product?column=id,name,price,stock,images,link&id=${productViewd}`).then(res => {
    //             const orderList = [];
    //             productViewd.split(',').map(id => {
    //                 const product = res.find(item => item.id === parseInt(id));
    //                 orderList.push(product);
    //                 return null;
    //             });
    //             setProducts(orderList.reverse());
    //         });
    //     }
    // }, []);

    return (
        <div className={cx('product-viewed')}>
            {products.length > 0 && <ProductByCategory title={t('viewedProduct')} listProduct={products} column={3} />}
        </div>
    );
}

export default memo(ProductViewed);
