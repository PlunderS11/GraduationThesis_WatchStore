import { Modal } from 'antd';
// import { useState } from 'react';

import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import styles from './ModalOrderUpdate.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const ModalOrderUpdate = (props) => {
    const { open, onClose, id } = props;

    const handleCancel = () => {
        onClose(false);
    };

    //-------------------------------------------------------------

    const navigation = useNavigate();
    // const [order, setOrder] = useState({});
    const [recipient, setRecipient] = useState({});

    const fecthData = async () => {
        if (id !== '') {
            const getOrder = async () => {
                const res = await axiosClient.get('order/admin/' + id);
                if (res) {
                    setRecipient(res.data.order.recipient);
                }
            };
            getOrder();
        }
    };

    useEffect(() => {
        try {
            fecthData();
        } finally {
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: recipient.username + '',
            phone: recipient.phone + '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Nhập tên Khách hàng'),
            phone: Yup.string().required('Nhập số điện thoại'),
        }),

        onSubmit: async (values) => {
            const { username, phone } = values;

            console.log(values);
            try {
                const res = await axiosClient.put('order/info/update/' + id, {
                    username: username,
                    phone: phone,
                });
                if (res) {
                    toast.success('Cập nhật thành công!');
                    handleCancel();
                    navigation('/orders');
                }
            } catch (error) {
                toast.error(error);
            }
        },
    });
    return (
        <>
            <Modal
                destroyOnClose
                onCancel={handleCancel}
                open={open}
                title="CẬP NHẬT THÔNG TIN KHÁCH HÀNG"
                width={740}
                centered
                footer={[]}
            >
                <form onSubmit={formik.handleSubmit} className={cx('add-orderupdate-form')} spellCheck="false">
                    <div className={cx('add-orderupdate-item')}>
                        <label>Thông tin khách hàng</label>
                    </div>
                    {JSON.stringify(recipient) !== '{}' && (
                        <div className={cx('add-orderupdate-item')}>
                            <InputField
                                type="text"
                                id="username"
                                name="username"
                                placeholder="."
                                value={formik.values.username}
                                label={'Tên khách hàng'}
                                require
                                touched={formik.touched.username}
                                error={formik.errors.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                    )}

                    <div className={cx('add-orderupdate-item')}>
                        <InputField
                            type="text"
                            id="phone"
                            name="phone"
                            placeholder="."
                            value={formik.values.phone}
                            label={'Số điện thoại'}
                            require
                            touched={formik.touched.phone}
                            error={formik.errors.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    {JSON.stringify(recipient) !== '{}' && (
                        <div className={cx('add-orderupdate-item')}>
                            <InputField
                                customClass={styles}
                                type="textarea"
                                readonly={true}
                                id="address"
                                name="address"
                                placeholder="."
                                value={
                                    recipient.address +
                                    ', ' +
                                    recipient.addressWard.WardName +
                                    ', ' +
                                    recipient.addressDistrict.DistrictName +
                                    ', ' +
                                    recipient.addressProvince.ProvinceName
                                }
                                label={'Địa chỉ'}
                                require
                                onChange={formik.handleChange}
                            />
                        </div>
                    )}

                    <Button type="submit" customClass={styles}>
                        Cập nhật
                    </Button>
                </form>
            </Modal>
        </>
    );
};
export default ModalOrderUpdate;
