import { Modal } from 'antd';
// import { useState } from 'react';

import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Spin } from 'antd';

import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import styles from './ModalUserRank.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const ModalUserRank = (props) => {
    const { open, onClose, id } = props;
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        setDelImg([]);
        onClose(false);
    };

    //-------------------------------------------------------------

    const [rank, setRank] = useState({});
    const navigation = useNavigate();

    const fecthData = async () => {
        if (id !== '') {
            const getProduct = async () => {
                const res = await axiosClient.get('rank/detail/' + String(id));
                setRank(res.data.detailRank);
            };
            getProduct();
        }
    };

    useEffect(() => {
        try {
            fecthData();
        } finally {
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

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
            namevi: rank.namevi + '',
            nameen: rank.nameen + '',
            icon: Array.prototype.slice.call(image),
            minValue: rank.minValue,
            maxValue: rank.maxValue,
            descriptionvi: rank.descriptionvi + '',
            descriptionen: rank.descriptionen + '',
        },
        validationSchema: Yup.object({
            namevi: Yup.string().required('Nhập tên tiếng Việt'),
            nameen: Yup.string().required('Nhập tên tiếng Anh'),
            minValue: Yup.string().required('Nhập chi tiêu tối thiểu'),
            maxValue: Yup.string().required('Nhập chi tiêu tối đa'),
            descriptionvi: Yup.string().required('Nhập mô tả tiếng Việt'),
            descriptionen: Yup.string().required('Nhập mô tả tiếng Anh'),
        }),
        onSubmit: async (values) => {
            const { namevi, nameen, icon, minValue, maxValue, descriptionen, descriptionvi } = values;
            const formData = new FormData();
            if (icon[0] !== undefined) {
                formData.append('icon', icon[0]);
            }
            formData.append('namevi', namevi);
            formData.append('nameen', nameen);
            formData.append('minValue', minValue);
            formData.append('maxValue', maxValue);
            formData.append('descriptionen', descriptionen);
            formData.append('descriptionvi', descriptionvi);

            setLoading(true);
            try {
                const res = await axiosClient.put('rank/' + id, formData);
                if (res) {
                    toast.success('Cập nhật thành công!');
                    handleCancel();
                    navigation('/ranks');
                }
            } finally {
                setLoading(false);
            }
        },
    });
    return (
        <>
            <Modal
                destroyOnClose
                onCancel={handleCancel}
                open={open}
                title="CẬP NHẬT THỨ HẠNG"
                width={740}
                centered
                footer={[]}
            >
                <div className={cx('new-collection')}>
                    {/* <h1 className={cx('add-collection-title')}>Cập nhật danh mục</h1> */}
                    <form onSubmit={formik.handleSubmit} className={cx('add-collection-form')} spellCheck="false">
                        <div className={cx('add-product-item')}>
                            <label className={cx('lable-update')}>Hình ảnh hiện tại thứ hạng</label>

                            <div className={cx('list-img')}>
                                <div className={cx('img')}>
                                    <img className={cx('item-img')} src={rank.icon} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className={cx('add-product-item')}>
                            <label className={cx('lable-update')}>Cập nhật hình ảnh thứ hạng</label>
                            {/* <input type="file" id="image" /> */}
                            <br />
                            <label className={cx('input-image')} for="images">
                                Chọn hình ảnh
                            </label>
                            <input
                                type="file"
                                id="images"
                                name="images"
                                accept="image/*"
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
                        <label className={cx('lable-update')}>Thông tin thứ hạng</label>

                        <div className={cx('add-collection-item')}>
                            <InputField
                                type="text"
                                id="namevi"
                                name="namevi"
                                placeholder="."
                                value={formik.values.namevi}
                                label={'Tên tiếng Việt'}
                                require
                                touched={formik.touched.namevi}
                                error={formik.errors.namevi}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        <div className={cx('add-collection-item')}>
                            <InputField
                                type="text"
                                id="nameen"
                                name="nameen"
                                placeholder="."
                                value={formik.values.nameen}
                                label={'Tên tiếng Anh'}
                                require
                                touched={formik.touched.nameen}
                                error={formik.errors.nameen}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <div className={cx('add-collection-item')}>
                            <InputField
                                type="text"
                                id="minValue"
                                name="minValue"
                                placeholder="."
                                value={String(formik.values.minValue)}
                                label={'Chi tiêu tối thiểu'}
                                require
                                touched={formik.touched.minValue}
                                error={formik.errors.minValue}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <div className={cx('add-collection-item')}>
                            <InputField
                                type="text"
                                id="maxValue"
                                name="maxValue"
                                placeholder="."
                                value={String(formik.values.maxValue)}
                                label={'Chi tiêu tối đa'}
                                require
                                touched={formik.touched.maxValue}
                                error={formik.errors.maxValue}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <div className={cx('add-collection-item')}>
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
                        <div className={cx('add-collection-item')}>
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
                        <Spin loading={loading}>
                            <Button type="submit" customClass={styles}>
                                Cập nhật
                            </Button>
                        </Spin>
                    </form>
                </div>
            </Modal>
        </>
    );
};
export default ModalUserRank;