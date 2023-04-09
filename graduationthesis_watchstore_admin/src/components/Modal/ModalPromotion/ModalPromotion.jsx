import { Modal } from 'antd';
// import { useState } from 'react';

import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import styles from './ModalPromotion.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const ModalPromotion = (props) => {
    const { open, onClose, id } = props;

    const handleCancel = () => {
        onClose(false);
    };

    //-------------------------------------------------------------

    const [promotion, setPromotion] = useState({});
    const navigate = useNavigate();

    const [startAt, setStartAt] = useState();
    const [endAt, setEndAt] = useState();

    const [start, setStart] = useState();
    const [end, setEnd] = useState();

    const fecthData = async () => {
        if (id !== '') {
            const getPromotion = async () => {
                const res = await axiosClient.get('promotion/detail/' + String(id));
                setPromotion(res.data.detailPromotion);
                setStartAt(new Date(res.data.detailPromotion.startDate));
                setEndAt(new Date(res.data.detailPromotion.endDate));

                const start = new Date(res.data.detailPromotion.startDate);
                const yyyy_start = start.getFullYear();
                let mm_start = start.getMonth() + 1; // Months start at 0!
                let dd_start = start.getDate();
                if (dd_start < 10) dd_start = '0' + dd_start;
                if (mm_start < 10) mm_start = '0' + mm_start;
                setStart(dd_start + '/' + mm_start + '/' + yyyy_start);

                const end = new Date(res.data.detailPromotion.endDate);
                const yyyy_end = end.getFullYear();
                let mm_end = end.getMonth() + 1; // Months end at 0!
                let dd_end = end.getDate();
                if (dd_end < 10) dd_end = '0' + dd_end;
                if (mm_end < 10) mm_end = '0' + mm_end;
                setEnd(dd_end + '/' + mm_end + '/' + yyyy_end);
            };
            getPromotion();
        }
    };

    useEffect(() => {
        try {
            fecthData();
        } finally {
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const onChangeStartDate = (date) => {
        if (date !== null) {
            const d = new Date(date);
            setStartAt(d);
        } else {
            setStartAt(null);
        }
    };
    const onChangeEndDate = (date) => {
        if (date !== null) {
            const d = new Date(date);
            setEndAt(d);
        } else {
            setEndAt(null);
        }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: promotion.title + '',
            code: promotion.code + '',
            value: promotion.value,
            startDate: startAt,
            endDate: endAt,
            isDelete: promotion.isDelete,
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
                const res = await axiosClient.put('promotion/' + id, {
                    title: title,
                    code: code,
                    value: value,
                    startDate: startDate,
                    endDate: endDate,
                    isDelete: isDelete,
                });
                if (res) {
                    toast.success('Cập nhật thành công!');
                    handleCancel();
                    navigate('/promotions');
                }
            } catch (error) {
                toast.error(error);
            }
        },
    });
    return (
        <>
            <Modal onCancel={handleCancel} open={open} title="CẬP NHẬT KHUYẾN MÃI" width={740} centered footer={[]}>
                <div className={cx('new-promotion')}>
                    <form onSubmit={formik.handleSubmit} className={cx('add-promotion-form')} spellCheck="false">
                        <div className={cx('add-promotion-item')}>
                            <label>Ngày bắt đầu</label>
                            {start !== undefined && (
                                <DatePicker
                                    defaultValue={dayjs(start, 'DD/MM/YYYY')}
                                    placeholder="Chọn ngày bắt đầu"
                                    className={cx('date-picker')}
                                    onChange={onChangeStartDate}
                                    format="DD/MM/YYYY"
                                />
                            )}
                            {formik.errors.startDate && (
                                <div className={cx('input-feedback')}>{formik.errors.startDate}</div>
                            )}
                        </div>
                        <div className={cx('add-promotion-item')}>
                            <label>Ngày kết thúc</label>
                            {end !== undefined && (
                                <DatePicker
                                    defaultValue={dayjs(end, 'DD/MM/YYYY')}
                                    placeholder="Chọn ngày kết thúc"
                                    className={cx('date-picker')}
                                    onChange={onChangeEndDate}
                                    format="DD/MM/YYYY"
                                />
                            )}

                            {formik.errors.endDate && (
                                <div className={cx('input-feedback')}>{formik.errors.endDate}</div>
                            )}
                        </div>
                        <div className={cx('add-promotion-item')}>
                            <label>Thông tin khuyến mãi</label>
                        </div>
                        <div className={cx('add-promotion-item')}>
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
                        <div className={cx('add-promotion-item')}>
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
                        <div className={cx('add-promotion-item')}>
                            <InputField
                                type="number"
                                id="value"
                                name="value"
                                placeholder="."
                                value={String(formik.values.value)}
                                label={'Giá trị khuyến mãi(%)'}
                                require
                                touched={formik.touched.value}
                                error={formik.errors.value}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        <Button type="submit" customClass={styles}>
                            Cập nhật
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
};
export default ModalPromotion;