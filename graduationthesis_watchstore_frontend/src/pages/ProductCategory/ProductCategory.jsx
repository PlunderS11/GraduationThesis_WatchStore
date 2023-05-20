import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Descriptions, Input, Select, Spin } from 'antd';

import ProductByCategory from '../../components/ProductByCategory/ProductByCategory';
import { changeProgress } from '../../features/loader';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/Button/Button';

import style from './ProductCategory.module.scss';
import { NumberWithCommas } from '../../functions';
import MyBreadcrumb from '../../components/Breadcrumb/MyBreadcrumb';

const cx = classNames.bind(style);

const ProductCategory = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState({
        name: undefined,
        collectionName: undefined,
        brand: undefined,
        stock: undefined,
        minValue: undefined,
        maxValue: undefined,
        type: params.type === 'accessory' ? 'strap' : 'watch',
        sex: params.type === 'accessory' ? undefined : params.type.split('')[0],
    });
    const [products, setProducts] = useState({});
    useEffect(() => {
        setQuery({ ...query, sex: params.type.split('')[0] });
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
                url = 'collections?type=strap';
                break;
            default:
        }
        const getProducts = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get(url, { params: {} });
                setProducts(res.data.prodCategory);
                dispatch(changeProgress(100));
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };
        getProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.type, t]);

    const handleSearch = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('collections', { params: { ...query } });
            setProducts(res.data.prodCategory);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('product-categories')}>
            <Spin spinning={loading}>
                <div className="container">
                    <MyBreadcrumb urlParams={t(`breadcrumbs.${params.type}`)} detail />
                    <div className={cx('filter')}>
                        <Descriptions title={t('button.search')} labelStyle={{ width: 80, marginLeft: 20 }}>
                            <Descriptions.Item label={t('productCategory.name')}>
                                <Input
                                    placeholder={t('productCategory.name')}
                                    onChange={e => setQuery({ ...query, name: e.target.value })}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label={t('productCategory.collection')}>
                                <Input
                                    placeholder={t('productCategory.collection')}
                                    onChange={e => setQuery({ ...query, collectionName: e.target.value })}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label={t('productCategory.brand')}>
                                <Input
                                    placeholder={t('productCategory.brand')}
                                    onChange={e => setQuery({ ...query, brand: e.target.value })}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label={t('productCategory.status')}>
                                <Select
                                    defaultValue={0}
                                    style={{ width: '100%' }}
                                    options={[
                                        { value: 0, label: '--' },
                                        { value: 1, label: t('productCategory.stocking') },
                                        { value: 2, label: t('productCategory.outOfStock') },
                                    ]}
                                    onChange={e => setQuery({ ...query, stock: e })}
                                ></Select>
                            </Descriptions.Item>
                            <Descriptions.Item label={t('productCategory.price')}>
                                <Select
                                    defaultValue={0}
                                    style={{ width: '100%' }}
                                    options={[
                                        { value: 0, label: '--' },
                                        { value: 1, label: `Dưới ${NumberWithCommas(500000)}` },
                                        {
                                            value: 2,
                                            label: `${NumberWithCommas(500000)} - ${NumberWithCommas(1000000)}`,
                                        },
                                        {
                                            value: 3,
                                            label: `${NumberWithCommas(1000000)} - ${NumberWithCommas(5000000)}`,
                                        },
                                        {
                                            value: 4,
                                            label: `${NumberWithCommas(5000000)} - ${NumberWithCommas(10000000)}`,
                                        },
                                        {
                                            value: 5,
                                            label: `Trên ${NumberWithCommas(10000000)}`,
                                        },
                                    ]}
                                    onChange={e => {
                                        switch (e) {
                                            case 0:
                                                setQuery({ ...query, minValue: undefined, maxValue: undefined });
                                                break;
                                            case 1:
                                                setQuery({ ...query, minValue: 0, maxValue: 500000 });
                                                break;
                                            case 2:
                                                setQuery({ ...query, minValue: 500000, maxValue: 1000000 });
                                                break;
                                            case 3:
                                                setQuery({ ...query, minValue: 1000000, maxValue: 5000000 });
                                                break;
                                            case 4:
                                                setQuery({ ...query, minValue: 5000000, maxValue: 10000000 });
                                                break;
                                            case 5:
                                                setQuery({ ...query, minValue: 10000000, maxValue: 999999999999 });
                                                break;
                                            default:
                                                break;
                                        }
                                    }}
                                ></Select>
                            </Descriptions.Item>
                            <Descriptions.Item contentStyle={{ justifyContent: 'center' }}>
                                <Button customClass={style} onclick={handleSearch}>
                                    {t('button.search')}
                                </Button>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
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
            </Spin>
        </div>
    );
};

export default ProductCategory;
