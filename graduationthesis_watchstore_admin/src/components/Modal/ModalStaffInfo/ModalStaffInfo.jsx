import { Modal } from 'antd';
// import { useState } from 'react';

import classNames from 'classnames/bind';

import InputField from '~/components/InputField/InputField';
import styles from './ModalStaffInfo.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Button from '~/components/Button/Button';

const cx = classNames.bind(styles);

const ModalStaffInfo = (props) => {
    const { open, onClose, id, onResetId } = props;

    const handleCancel = () => {
        onResetId('');
        onClose(false);
    };

    //-------------------------------------------------------------

    const [user, setUser] = useState({});

    const fecthData = async () => {
        // console.log(id);
        if (id !== undefined) {
            const getUser = async () => {
                const res = await axiosClient.get('user/find/' + String(id));
                setUser(res.data);
            };
            getUser();
        }
    };

    useEffect(() => {
        try {
            fecthData();
        } finally {
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    //---------------------------------------------------------------------------------

    const navigate = useNavigate();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: user.username + '',
            phone: user.phone + '',
            sex: user.sex + '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Nhập tên nhân viên'),
            phone: Yup.string()
                .required('Nhập số điện thoại nhân viên')
                .matches(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/, 'Nhập số điện thoại không chính xác'),
            sex: Yup.string().required('Chọn giới tính'),
        }),
        onSubmit: async (values) => {
            const { username, phone, sex } = values;

            try {
                const res = await axiosClient.put('user/update/' + id, {
                    username: username,
                    phone: phone,
                    sex: sex,
                });
                if (res) {
                    toast.success('Cập nhật thành công!');
                    handleCancel();
                    navigate('/staffs');
                }
            } catch (error) {
                toast.error(error);
            }
        },
    });
    return (
        <>
            <Modal
                destroyOnClose={true}
                onCancel={handleCancel}
                open={open}
                title="THÔNG TIN NHÂN VIÊN"
                width={740}
                centered
                footer={[]}
            >
                <div className={cx('new-user')}>
                    {/* <h1 className={cx('add-product-title')}>Cập nhật danh mục</h1> */}
                    <form onSubmit={formik.handleSubmit} className={cx('add-user-form')} spellCheck="false">
                        <div className={cx('add-user-item')}>
                            <label>Thông tin nhân viên</label>
                        </div>
                        <div className={cx('add-user-item')}>
                            <InputField
                                type="text"
                                id="username"
                                name="username"
                                placeholder="."
                                value={formik.values.username}
                                label={'Tên nhân viên'}
                                require
                                touched={formik.touched.username}
                                error={formik.errors.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <div className={cx('add-user-item')}>
                            <InputField
                                customClass={styles}
                                readonly={true}
                                type="text"
                                id="email"
                                name="email"
                                value={String(user.email)}
                                placeholder="."
                                label={'Email'}
                                require
                            />
                        </div>
                        <div className={cx('add-user-item')}>
                            <InputField
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="."
                                value={formik.values.phone}
                                label={'Số điện thoại nhân viên'}
                                require
                                touched={formik.touched.phone}
                                error={formik.errors.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <div className={cx('add-user-item')}>
                            <InputField
                                customClass={styles}
                                readonly={true}
                                type="text"
                                id="created_at"
                                name="created_at"
                                placeholder="."
                                value={String(new Date(user.createdAt).toLocaleString())}
                                label={'Ngày tạo'}
                                require
                            />
                        </div>
                        <div className={cx('add-user-item')}>
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
                        <Button type="submit" customClass={styles}>
                            Cập nhật
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
};
export default ModalStaffInfo;
