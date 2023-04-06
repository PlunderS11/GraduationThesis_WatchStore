import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import ProductByCategory from '../../components/ProductByCategory/ProductByCategory';
import { changeProgress } from '../../features/loader';
import axiosClient from '../../api/axiosClient';

import style from './ProductCategory.module.scss';

const cx = classNames.bind(style);

const ProductCategory = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const params = useParams();

    const [products, setProducts] = useState({});
    useEffect(() => {
        dispatch(changeProgress(95));
        let url;
        switch (params.type) {
            case 'man':
                url = 'collections?type=watch&sex=m';
                break;
            case 'woman':
                url = 'collections?type=watch&sex=w';
                break;
            case 'accessory':
                url = 'collections?type=strap,bracelet';
                break;
            default:
        }
        const getProducts = async () => {
            const res = await axiosClient.get(url);
            setProducts(res.data.prodCategory);
            dispatch(changeProgress(100));
        };
        getProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.type, t]);
    return (
        <div className={cx('product-categories')}>
            <div className={cx('container')}>
                {products.length > 0 &&
                    products.map(item => {
                        return (
                            <ProductByCategory
                                key={item._id}
                                title={item.name}
                                descriptionvi={item.descriptionvi}
                                descriptionen={item.descriptionen}
                                listProduct={item.products}
                                column={3}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export default ProductCategory;
