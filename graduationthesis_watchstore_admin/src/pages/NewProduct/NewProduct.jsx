import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';

import styles from './NewProduct.module.scss';
import axiosClient from '~/api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

export default function NewProduct() {
    const [collections, setCollections] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const getCollections = async () => {
            const res = await axiosClient.get('collections/allCols/');
            setCollections(res.data.collections);
        };
        getCollections();
    }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
            brand: '',
            type: '',
            price: '',
            sex: '',
            images: '',
            collectionName: '',
            descriptionen: '',
            featuresen: '',
            sold: 0,
            stock: '',
            descriptionvi: '',
            featuresvi: '',
        },
        validationSchema: Yup.object({
            type: Yup.string().required('Chọn loại sản phẩm'),
            sex: Yup.string().required('Chọn gới tính'),
            collectionName: Yup.string().required('Chọn bộ sưu tập'),
            name: Yup.string().required('Nhập tên sản phẩm'),
            brand: Yup.string().required('Nhập hãng'),
            price: Yup.string().required('Nhập giá'),
            descriptionen: Yup.string().required('Nhập mô tả tiếng Anh'),
            featuresen: Yup.string().required('Nhập tính năng tiếng Anh'),
            stock: Yup.string().required('Nhập tồn kho'),
            descriptionvi: Yup.string().required('Nhập mô tả tiếng Việt'),
            featuresvi: Yup.string().required('Nhập tính năng tiếng Việt'),
        }),
        onSubmit: async (values) => {
            const {
                name,
                brand,
                type,
                price,
                sex,
                images,
                collectionName,
                descriptionen,
                featuresen,
                sold,
                stock,
                descriptionvi,
                featuresvi,
            } = values;
            console.log(values);
            try {
                await axiosClient.post('product/', {
                    name: name,
                    brand: brand,
                    type: type,
                    price: price,
                    sex: sex,
                    images: images,
                    collectionName: collectionName,
                    descriptionen: descriptionen,
                    featuresen: featuresen.split(';'),
                    sold: sold,
                    stock: stock,
                    descriptionvi: descriptionvi,
                    featuresvi: featuresvi.split(';'),
                });
                toast.success('Thêm thành công!');

                navigate('/products');
            } catch (error) {
                toast.error(error);
            }
        },
    });

    return (
        <div className={cx('new-product')}>
            <h1 className={cx('add-product-title')}>Thêm mới sản phẩm</h1>
            <form onSubmit={formik.handleSubmit} className={cx('add-product-form')} spellCheck="false">
                <div className={cx('add-product-item')}>
                    <label>Hình ảnh</label>
                    <input type="file" id="image" />
                </div>
                <div className={cx('add-product-item')}>
                    <label>Loại</label>
                    <select
                        className={cx('select-item')}
                        id="type"
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="" label="--Chọn loại sản phẩm--">
                            --Chọn loại sản phẩm--
                        </option>
                        <option value="watch" label="Watch">
                            Watch
                        </option>
                        <option value="strap" label="Strap">
                            Strap
                        </option>
                        <option value="bracelet" label="Bracelet">
                            Bracelet
                        </option>
                        <option value="box" label="Box">
                            Box
                        </option>
                    </select>
                    {formik.errors.type && <div className={cx('input-feedback')}>{formik.errors.type}</div>}
                </div>

                <div className={cx('add-product-item')}>
                    <label>Giới tính</label>
                    <select
                        className={cx('select-item')}
                        id="sex"
                        name="sex"
                        value={formik.values.sex}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="" label="--Chọn giới tính--">
                            --Chọn giới tính--
                        </option>
                        <option value="m" label="Nam">
                            {' '}
                            Nam
                        </option>
                        <option value="w" label="Nữ">
                            Nữ
                        </option>
                    </select>
                    {formik.errors.sex && <div className={cx('input-feedback')}>{formik.errors.sex}</div>}
                </div>

                <div className={cx('add-product-item')}>
                    <label>Danh mục</label>
                    <select
                        className={cx('select-item')}
                        id="collectionName"
                        name="collectionName"
                        value={formik.values.collectionName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="" label="--Chọn danh mục--">
                            --Chọn danh mục--
                        </option>
                        {collections.map((col, index) => {
                            return (
                                <option key={index} value={col.name} label={col.name}>
                                    {col.name}
                                </option>
                            );
                        })}
                    </select>
                    {formik.errors.collectionName && (
                        <div className={cx('input-feedback')}>{formik.errors.collectionName}</div>
                    )}
                </div>

                <div className={cx('add-product-item')}>
                    <label>Thông tin sản phẩm</label>
                </div>
                <div className={cx('add-product-item')}>
                    <InputField
                        type="text"
                        id="name"
                        name="name"
                        placeholder="."
                        value={formik.values.name}
                        label={'Tên sản phẩm'}
                        require
                        touched={formik.touched.name}
                        error={formik.errors.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div className={cx('add-product-item')}>
                    <InputField
                        type="text"
                        id="brand"
                        name="brand"
                        placeholder="."
                        value={formik.values.brand}
                        label={'Hãng'}
                        require
                        touched={formik.touched.brand}
                        error={formik.errors.brand}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div className={cx('add-product-item')}>
                    <InputField
                        type="number"
                        id="price"
                        name="price"
                        placeholder="."
                        value={formik.values.price}
                        label={'Giá'}
                        require
                        touched={formik.touched.price}
                        error={formik.errors.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>

                <div className={cx('add-product-item')}>
                    <InputField
                        type="number"
                        id="stock"
                        name="stock"
                        placeholder="."
                        value={formik.values.stock}
                        label={'Tồn kho'}
                        require
                        touched={formik.touched.stock}
                        error={formik.errors.stock}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div className={cx('add-product-item')}>
                    <InputField
                        type="textarea"
                        id="descriptionen"
                        name="descriptionen"
                        placeholder="."
                        value={formik.values.descriptionen}
                        label={'Mô tả tiếng Anh'}
                        require
                        touched={formik.touched.descriptionen}
                        error={formik.errors.descriptionen}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div className={cx('add-product-item')}>
                    <InputField
                        type="textarea"
                        id="descriptionvi"
                        name="descriptionvi"
                        placeholder="."
                        value={formik.values.descriptionvi}
                        label={'Mô tả tiếng Việt'}
                        require
                        touched={formik.touched.descriptionvi}
                        error={formik.errors.descriptionvi}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div className={cx('add-product-item')}>
                    <InputField
                        type="textarea"
                        id="featuresen"
                        name="featuresen"
                        placeholder="."
                        value={formik.values.featuresen}
                        label={'Tính năng tiếng Anh'}
                        require
                        touched={formik.touched.featuresen}
                        error={formik.errors.featuresen}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div className={cx('add-product-item')}>
                    <InputField
                        type="textarea"
                        id="featuresvi"
                        name="featuresvi"
                        placeholder="."
                        value={formik.values.featuresvi}
                        label={'Tính năng tiếng Việt'}
                        require
                        touched={formik.touched.featuresvi}
                        error={formik.errors.featuresvi}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <Button type="submit" customClass={styles}>
                    Thêm
                </Button>
            </form>
        </div>
    );
}
