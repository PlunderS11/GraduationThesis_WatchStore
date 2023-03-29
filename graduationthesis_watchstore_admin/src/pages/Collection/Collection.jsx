import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import styles from './Collection.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

export default function NewCollection() {
    const params = useParams();
    const navigate = useNavigate();
    const [collection, setCollection] = useState({});

    const collectionId = params.collectionId;

    useEffect(() => {
        const getProduct = async () => {
            const res = await axiosClient.get('collections/detail/' + collectionId);
            setCollection(res.data.detailCollection);
        };
        getProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: collection.name + '',
            descriptionen: collection.descriptionen + '',
            descriptionvi: collection.descriptionvi + '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Nhập tên danh mục'),
            descriptionen: Yup.string().required('Nhập mô tả tiếng Anh'),
            descriptionvi: Yup.string().required('Nhập mô tả tiếng Việt'),
        }),
        onSubmit: async (values) => {
            const { name, descriptionen, descriptionvi } = values;
            // console.log(values);
            try {
                await axiosClient.put('collections/update/' + collectionId, {
                    name: name,
                    descriptionen: descriptionen,
                    descriptionvi: descriptionvi,
                });
                toast.success('Cập nhật thành công!');
                navigate('/collections');
            } catch (error) {
                toast.error(error);
            }
        },
    });

    return (
        <div className={cx('new-product')}>
            <h1 className={cx('add-product-title')}>Cập nhật danh mục</h1>
            <form onSubmit={formik.handleSubmit} className={cx('add-product-form')} spellCheck="false">
                <div className={cx('add-product-item')}>
                    <label>Thông tin danh mục</label>
                </div>
                <div className={cx('add-product-item')}>
                    <InputField
                        type="text"
                        id="name"
                        name="name"
                        placeholder="."
                        value={formik.values.name}
                        label={'Tên danh mục'}
                        require
                        touched={formik.touched.name}
                        error={formik.errors.name}
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

                <Button type="submit" customClass={styles}>
                    Cập nhật
                </Button>
            </form>
        </div>
    );
}
