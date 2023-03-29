import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from 'antd';

import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import styles from './NewPromotion.module.scss';
import axiosClient from '~/api/axiosClient';

const cx = classNames.bind(styles);

export default function NewPromotion() {
    const navigate = useNavigate();
    const [startAt, setStartAt] = useState();
    const [endAt, setEndAt] = useState();

    const onChangeStartDate = (date) => {
        if (date !== null) {
            const d = new Date(date);
            setStartAt(d);
        }
    };
    const onChangeEndDate = (date) => {
        if (date !== null) {
            const d = new Date(date);
            setEndAt(d);
        }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: '',
            code: '',
            value: '',
            startDate: startAt,
            endDate: endAt,
            isDelete: false,
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Nhập tên khuyến mãi'),
            code: Yup.string().required('Nhập mã khuyến mãi'),
            value: Yup.number()
                .min(1, 'Giá trị khuyến mãi phải lớn hơn hoặc bằng 1')
                .max(99, 'Giá trị khuyến mãi phải nhỏ hơn hoặc bằng 99')
                .required('Nhập giá trị khuyến mãi(%)'),
            startDate: Yup.string().required('Chọn ngày bắt đầu'),
            endDate: Yup.string().required('Chọn ngày kết thúc'),
        }),
        onSubmit: async (values) => {
            const { title, code, value, startDate, endDate, isDelete } = values;
            // console.log(values);

            try {
                await axiosClient.post('promotion/', {
                    title: title,
                    code: code,
                    value: value,
                    startDate: startDate,
                    endDate: endDate,
                    isDelete: isDelete,
                });
                toast.success('Thêm thành công!');

                navigate('/promotions');
            } catch (error) {
                toast.error(error);
            }
        },
    });

    return (
        <div className={cx('new-product')}>
            <h1 className={cx('add-product-title')}>Thêm mới khuyến mãi</h1>
            <form onSubmit={formik.handleSubmit} className={cx('add-product-form')} spellCheck="false">
                <div className={cx('add-product-item')}>
                    <label>Ngày bắt đầu</label>
                    <DatePicker
                        placeholder="Chọn ngày bắt đầu"
                        className={cx('date-picker')}
                        onChange={onChangeStartDate}
                        format="DD/MM/YYYY"
                    />
                    {formik.errors.startDate && <div className={cx('input-feedback')}>{formik.errors.startDate}</div>}
                </div>
                <div className={cx('add-product-item')}>
                    <label>Ngày kết thúc</label>
                    <DatePicker
                        placeholder="Chọn ngày kết thúc"
                        className={cx('date-picker')}
                        onChange={onChangeEndDate}
                        format="DD/MM/YYYY"
                    />
                    {formik.errors.endDate && <div className={cx('input-feedback')}>{formik.errors.endDate}</div>}
                </div>
                <div className={cx('add-product-item')}>
                    <label>Thông tin khuyến mãi</label>
                </div>
                <div className={cx('add-product-item')}>
                    <InputField
                        type="text"
                        id="title"
                        name="title"
                        placeholder="."
                        value={formik.values.title}
                        label={'Tên khuyến mãi'}
                        require
                        touched={formik.touched.title}
                        error={formik.errors.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div className={cx('add-product-item')}>
                    <InputField
                        type="text"
                        id="code"
                        name="code"
                        placeholder="."
                        value={formik.values.code}
                        label={'Mã khuyến mãi'}
                        require
                        touched={formik.touched.code}
                        error={formik.errors.code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div className={cx('add-product-item')}>
                    <InputField
                        type="number"
                        id="value"
                        name="value"
                        placeholder="."
                        value={formik.values.value}
                        label={'Giá trị khuyến mãi(%)'}
                        require
                        touched={formik.touched.value}
                        error={formik.errors.value}
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
