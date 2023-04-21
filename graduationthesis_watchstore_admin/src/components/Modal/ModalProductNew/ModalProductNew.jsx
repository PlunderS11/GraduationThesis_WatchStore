import { Modal } from 'antd';
import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Spin } from 'antd';

import styles from './ModalProductNew.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';
import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const ModalProductNew = (props) => {
    const { open, onClose } = props;
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        formik.values.name = '';
        formik.values.brand = '';
        formik.values.type = '';
        formik.values.originalPrice = '';
        formik.values.sex = '';
        formik.values.images = [];
        formik.values.collectionId = '';
        formik.values.descriptionen = '';
        formik.values.descriptionvi = '';
        formik.values.featuresvi = '';
        formik.values.featuresen = '';
        formik.values.stock = '';
        formik.values.note = '';

        formik.errors.name = '';
        formik.errors.brand = '';
        formik.errors.type = '';
        formik.errors.originalPrice = '';
        formik.errors.sex = '';
        formik.errors.images = '';
        formik.errors.collectionId = '';
        formik.errors.descriptionen = '';
        formik.errors.descriptionvi = '';
        formik.errors.featuresvi = '';
        formik.errors.featuresen = '';
        formik.errors.stock = '';
        formik.errors.note = '';
        setDelImg([]);
        onClose(false);
    };

    //-------------------------------------------------------------

    const navigate = useNavigate();
    const [collections, setCollections] = useState([]);

    const fecthData = async () => {
        const getCollections = async () => {
            const res = await axiosClient.get('collections/allCols/');
            setCollections(res.data.collections);
        };
        getCollections();
    };

    useEffect(() => {
        try {
            fecthData();
        } finally {
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //input img
    //-----------------------------------------------------------
    const [image, setImage] = useState([]);
    const [delImg, setDelImg] = useState([]);

    const handleMultiFile = (e) => {
        setImage(e.target.files);
        setDelImg(Array.from(e.target.files));
    };

    const handleDelImg = (i) => {
        delImg.splice(i, 1);
        setDelImg([...delImg]);
        setImage([...delImg]);
    };
    //-----------------------------------------------------------

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: '',
            brand: '',
            type: '',
            originalPrice: '',
            // finalPrice: '',
            sex: '',
            images: Array.prototype.slice.call(image),
            collectionId: '',
            descriptionvi: '',
            descriptionen: '',
            featuresvi: '',
            featuresen: '',
            note: '',
            sold: 0,
            stock: '',
            isDelete: false,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Nhập tên sản phẩm'),
            brand: Yup.string().required('Nhập hãng'),
            type: Yup.string().required('Chọn loại sản phẩm'),
            originalPrice: Yup.number().required('Nhập giá ban đầu').min(1, 'Giá ban đầu phải lớn hơn 0'),
            // finalPrice: Yup.string().required('Nhập giá cuối'),
            sex: Yup.string().required('Chọn gới tính'),
            images: Yup.array().min(1, 'Chọn hình ảnh sản phẩm'),
            collectionId: Yup.string().required('Chọn bộ sưu tập'),
            descriptionvi: Yup.string().required('Nhập mô tả tiếng Việt'),
            descriptionen: Yup.string().required('Nhập mô tả tiếng Anh'),
            featuresvi: Yup.string().required('Nhập tính năng tiếng Việt'),
            featuresen: Yup.string().required('Nhập tính năng tiếng Anh'),
            stock: Yup.number().required('Nhập tồn kho').min(1, 'Tồn kho phải lớn hơn 0'),
        }),
        onSubmit: async (values) => {
            const {
                name,
                brand,
                type,
                originalPrice,
                // finalPrice,
                sex,
                images,
                collectionId,
                descriptionvi,
                descriptionen,
                featuresvi,
                featuresen,
                note,
                sold,
                stock,
                isDelete,
            } = values;

            // console.log(values);

            const formData = new FormData();
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }
            formData.append('name', name);
            formData.append('brand', brand);
            formData.append('type', type);
            formData.append('originalPrice', originalPrice);
            // formData.append('finalPrice', finalPrice);
            formData.append('sex', sex);
            formData.append('collectionId', collectionId);
            formData.append('descriptionvi', descriptionvi);
            formData.append('descriptionen', descriptionen);
            formData.append('featuresvi', featuresvi.split(';'));
            formData.append('featuresen', featuresen.split(';'));
            formData.append('note', note);
            formData.append('sold', sold);
            formData.append('stock', stock);
            formData.append('isDelete', isDelete);
            console.log(formData);

            setLoading(true);
            try {
                const res = await axiosClient.post('product/', formData);
                if (res) {
                    toast.success('Thêm thành công!');
                    handleCancel();
                    navigate('/products');
                }
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <>
            <Modal
                destroyOnClose={true}
                onCancel={handleCancel}
                open={open}
                title="THÊM MỚI SẢN PHẨM"
                width={800}
                centered
                footer={[]}
            >
                <div className={cx('new-product')}>
                    <form onSubmit={formik.handleSubmit} className={cx('add-product-form')} spellCheck="false">
                        <div className={cx('add-product-item')}>
                            <label>Hình ảnh</label>
                            {/* <input type="file" id="image" /> */}
                            <label className={cx('input-image')} htmlFor="images">
                                Chọn hình ảnh
                            </label>
                            <input
                                type="file"
                                id="images"
                                name="images"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleMultiFile(e)}
                                hidden
                            />
                            <div className={cx('list-img')}>
                                {delImg.map((img, i) => (
                                    <div className={cx('img')} key={i}>
                                        <img className={cx('item-img')} src={URL.createObjectURL(img)} alt="" />
                                        <i className={cx('btn-x')} onClick={() => handleDelImg(i)}>
                                            X
                                        </i>
                                    </div>
                                ))}
                            </div>
                            {formik.errors.images && <div className={cx('input-feedback')}>{formik.errors.images}</div>}
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
                                id="collectionId"
                                name="collectionId"
                                value={formik.values.collectionId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="" label="--Chọn danh mục--">
                                    --Chọn danh mục--
                                </option>
                                {collections.map((col, index) => {
                                    return (
                                        <option key={index} value={col._id} label={col.name}>
                                            {col.name}
                                        </option>
                                    );
                                })}
                            </select>
                            {formik.errors.collectionId && (
                                <div className={cx('input-feedback')}>{formik.errors.collectionId}</div>
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
                                id="originalPrice"
                                name="originalPrice"
                                placeholder="."
                                value={formik.values.originalPrice}
                                label={'Giá'}
                                require
                                touched={formik.touched.originalPrice}
                                error={formik.errors.originalPrice}
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
                        <div className={cx('add-product-item')}>
                            <InputField
                                type="textarea"
                                id="note"
                                name="note"
                                placeholder="."
                                value={formik.values.note}
                                label={'Ghi chú'}
                                require
                                touched={formik.touched.note}
                                error={formik.errors.note}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <Spin spinning={loading}>
                            <Button type="submit" customClass={styles}>
                                Thêm
                            </Button>
                        </Spin>
                    </form>
                </div>
            </Modal>
        </>
    );
};
export default ModalProductNew;
