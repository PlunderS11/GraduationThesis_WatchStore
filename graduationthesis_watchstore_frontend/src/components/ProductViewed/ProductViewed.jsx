import classNames from 'classnames/bind';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';

import ProductByCategory from '../ProductByCategory/ProductByCategory';
import style from './ProductViewed.module.scss';

const cx = classNames.bind(style);

function ProductViewed() {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const productViewed = sessionStorage.getItem('productsViewed');

        if (productViewed) {
            const getProductViewed = async () => {
                const res = await axiosClient.get(`product/viewed?id=${productViewed}`);
                setProducts(res.data.productViewed.reverse());
            };
            getProductViewed();
        }
    }, []);

    return (
        <div className={cx('product-viewed')}>
            {products.length > 0 && <ProductByCategory title={t('viewedProduct')} listProduct={products} column={3} />}
        </div>
    );
}

export default memo(ProductViewed);
