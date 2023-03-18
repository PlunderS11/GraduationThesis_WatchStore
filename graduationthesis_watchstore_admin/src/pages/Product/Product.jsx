import classNames from 'classnames/bind';
// import { Publish } from '@material-ui/icons';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { productData } from '../../data/dummyData.js';
import styles from './Product.module.scss';
import Chart from '~/components/Chart/Chart';
import axiosClient from '~/api/axiosClient';
import InputField from '~/components/InputField/InputField';
import Button from '~/components/Button/Button';

const cx = classNames.bind(styles);

export default function Product() {
    const params = useParams();
    const [product, setProduct] = useState({});
    const [img, setImg] = useState();
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        const getCollections = async () => {
            const res = await axiosClient.get('collections/allCols/');
            setCollections(res.data.collections);
        };
        getCollections();
    }, []);

    useEffect(() => {
        const productId = params.productId;
        const getProduct = async () => {
            const res = await axiosClient.get('product/detail/' + productId);
            setProduct(res.data.detailProduct);
            setImg(
                res.data.detailProduct.images === ''
                    ? 'data:image/jpeg;base64,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'
                    : JSON.parse(res.data.detailProduct.images)[0],
            );
        };
        getProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // console.log([].concat(product.featuresen).join(';'));

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: product.name + '',
            brand: product.brand + '',
            type: product.type + '',
            price: product.price,
            sex: product.sex + '',
            images: product.images,
            collectionName: product.collectionName + '',
            descriptionen: product.descriptionen + '',
            featuresen: [].concat(product.featuresen).join(';'),
            sold: product.sold,
            stock: product.stock,
            descriptionvi: product.descriptionvi + '',
            featuresvi: [].concat(product.featuresvi).join(';'),
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
            // console.log(values);
            // try {
            //     await axiosClient.post('product/', {
            //         name: name,
            //         brand: brand,
            //         type: type,
            //         price: price,
            //         sex: sex,
            //         images: images,
            //         collectionName: collectionName,
            //         descriptionen: descriptionen,
            //         featuresen: featuresen.split(';'),
            //         sold: sold,
            //         stock: stock,
            //         createdAt: createdAt,
            //         updatedAt: updatedAt,
            //         descriptionvi: descriptionvi,
            //         featuresvi: featuresvi.split(';'),
            //     });
            //     toast.success('Thêm thành công!');

            //     navigate('/products');
            // } catch (error) {
            //     toast.error(error);
            // }
        },
    });

    return (
        <div className={cx('product')}>
            <div className={cx('product-title-container')}>
                <h1 className={cx('product-title')}>Chỉnh sửa thông tin sản phẩm</h1>
            </div>
            <div className={cx('product-top')}>
                <div className={cx('product-top-right')}>
                    <div className={cx('product-info-top')}>
                        <img src={img} alt="" className={cx('product-info-img')} />
                        <span className={cx('product-name')}>{product.name}</span>
                    </div>
                    <div className={cx('product-info-bottom')}>
                        <div className={cx('product-info-item')}>
                            <span className={cx('product-info-key')}>Đã bán:</span>
                            <span className={cx('product-info-value')}>{product.sold}</span>
                        </div>
                        <div className={cx('product-info-item')}>
                            <span className={cx('product-info-key')}>Tồn kho:</span>
                            <span className={cx('product-info-value')}>{product.stock}</span>
                        </div>
                    </div>
                </div>
                <div className={cx('product-top-left')}>
                    <Chart data={productData} dataKey="Sales" title="Hiệu suất bán hàng" />
                </div>
            </div>
            <div className={cx('product-bottom')}>
                {/* <form className={cx('product-form')}> */}
                {/* <div className={cx('product-form-left')}> */}
                <label>Cập nhật sản phẩm</label>

                <form onSubmit={formik.handleSubmit} className={cx('add-product-form')} spellCheck="false">
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
                            value={String(formik.values.price)}
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
                            value={String(formik.values.stock)}
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
                        Cập nhật
                    </Button>
                </form>
                {/* </div> */}
                {/* <div className={cx('product-form-right')}>
                    <div className={cx('product-upload')}>
                        <img
                            src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                            alt=""
                            className={cx('product-upload-img')}
                        />
                        <label>
                            <Publish />
                        </label>
                        <input type="file" id="file" style={{ display: 'none' }} />
                    </div>
                    <button className={cx('product-button')}>Cập nhật</button>
                </div> */}
                {/* </form> */}
            </div>
        </div>
    );
}
