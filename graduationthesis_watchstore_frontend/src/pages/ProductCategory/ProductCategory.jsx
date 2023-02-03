import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import ProductByCategory from '../../components/ProductByCategory/ProductByCategory';
import style from './ProductCategory.module.scss';

const cx = classNames.bind(style);

const product = [
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
];

const ProductCategory = () => {
    const dispatch = useDispatch();
    const params = useParams();

    const [products, setProducts] = useState({});
    useEffect(() => {
        // dispatch(changeProgress(50));
        let url, name, description;
        switch (params.type) {
            case 'box':
                url = 'product/collections?type=box';
                name = 'THE BOX';
                description = 'MÔ TẢ HỘP';
                break;
            case 'man':
                url = 'product/collections?type=watch&sex=m';
                name = 'ĐỒNG HỒ NAM';
                description = 'MÔ TẢ ĐỒNG HỒ NAM';
                break;
            case 'woman':
                url = 'product/collections?type=watch&sex=w';
                name = 'ĐỒNG HỒ NỮ';
                description = 'MÔ TẢ ĐỒNG HỒ NỮ';
                break;
            case 'accessory':
                url = 'product/collections?type=strap,bracelet';
                name = 'PHỤ KIỆN';
                description = 'MÔ TẢ PHỤ KIỆN';
                break;
            default:
        }
        setProducts({
            url,
            name,
            description,
            product,
        });
        // http.get(http.Dyoss, url).then(res => {
        //     setProducts(res);
        //     dispatch(changeProgress(100));
        // });
    }, [params.type, dispatch]);
    return (
        <div className={cx('product-categories')}>
            <div className={cx('container')}>
                <ProductByCategory
                    title={products.name}
                    description={products.description}
                    listProduct={products.product}
                    column={3}
                />
            </div>
        </div>
    );
};

export default ProductCategory;
