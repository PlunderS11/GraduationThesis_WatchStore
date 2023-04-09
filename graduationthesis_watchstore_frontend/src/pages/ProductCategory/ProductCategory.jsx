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
        price: undefined,
    });

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
                url = 'collections?type=strap';
                break;
            default:
        }
        const getProducts = async () => {
            const res = await axiosClient.get(url, { params: {} });
            setProducts(res.data.prodCategory);
            dispatch(changeProgress(100));
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
                    <div className={cx('filter')}>
                        <Descriptions title={'Tìm kiếm'}>
                            <Descriptions.Item label={'Tên'}>
                                <Input
                                    placeholder="afaef"
                                    onChange={e => setQuery({ ...query, name: e.target.value })}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label={'Danh muc'}>
                                <Input
                                    placeholder="Danh mục"
                                    onChange={e => setQuery({ ...query, collectionName: e.target.value })}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label={'Hãng'}>
                                <Input
                                    placeholder="Hãng"
                                    onChange={e => setQuery({ ...query, brand: e.target.value })}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label={'Trạng thái'}>
                                <Select
                                    defaultValue={0}
                                    options={[
                                        { value: 0, label: 'Còn hàng' },
                                        { value: 1, label: 'Hết hàng' },
                                    ]}
                                    onChange={e => setQuery({ ...query, stock: e })}
                                ></Select>
                            </Descriptions.Item>
                            <Descriptions.Item label={'Giá'}>
                                <Select
                                    defaultValue={0}
                                    style={{ width: 190 }}
                                    options={[
                                        { value: 0, label: `Dưới ${NumberWithCommas(500000)}` },
                                        {
                                            value: 1,
                                            label: `${NumberWithCommas(500000)} - ${NumberWithCommas(1000000)}`,
                                        },
                                        {
                                            value: 2,
                                            label: `${NumberWithCommas(1000000)} - ${NumberWithCommas(5000000)}`,
                                        },
                                        {
                                            value: 3,
                                            label: `${NumberWithCommas(5000000)} - ${NumberWithCommas(10000000)}`,
                                        },
                                    ]}
                                    onChange={e => setQuery({ ...query, price: e })}
                                ></Select>
                            </Descriptions.Item>
                            <Descriptions.Item>
                                <Button onclick={handleSearch}>Tìm kiếm</Button>
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
