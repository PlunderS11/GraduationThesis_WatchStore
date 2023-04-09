import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import axiosClient from '../../api/axiosClient';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import style from './ForgotPassword.module.scss';
import { Descriptions, Input, Modal, Spin } from 'antd';

const cx = classNames.bind(style);

const Forgotpassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [visibleModalForgotPassword, setVisibleModaForgotPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [userId, setUserId] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required('login.userError'),
        }),
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async values => {
            const { email } = values;
            try {
                setLoading(true);
                const res = await axiosClient.post('auth/forgotPassword', {
                    email: email,
                });
                setUserId(res.data.userId);
                setVisibleModaForgotPassword(true);
            } catch (error) {
                toast.error(t(`login.error.${error.response.status}`));
            } finally {
                setLoading(false);
            }
        },
    });

    const handleVerifyNewPass = async () => {
        try {
            setLoading(true);
            await axiosClient.post('auth/verifyForgotPassword', {
                userId,
                otp,
                password: newPassword,
            });
            toast.success(t('login.forgot.success'));
            setVisibleModaForgotPassword(false);
            navigate('/login');
        } catch (error) {
            const errorCode = error.response.data.status.toString();
            toast.error(t(`register.error.${errorCode}`));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={cx('login-page')}>
            <Spin spinning={loading}>
                <div className={cx('container')}>
                    <Modal
                        title={t('register.modal.title')}
                        open={visibleModalForgotPassword}
                        onOk={handleVerifyNewPass}
                        onCancel={() => setVisibleModaForgotPassword(false)}
                    >
                        <Descriptions column={1}>
                            <Descriptions.Item label={t('register.modal.input')}>
                                <Input
                                    placeholder={t('register.modal.input')}
                                    allowClear
                                    onChange={e => setOtp(e.target.value)}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label={t('register.modal.newpass')}>
                                <Input.Password
                                    placeholder={t('register.modal.newpass')}
                                    allowClear
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                            </Descriptions.Item>
                        </Descriptions>
                    </Modal>
                    <h2 className={cx('title')}>{t('login.forgot.forgotPassword')}</h2>
                    <form className={cx('login-form')} onSubmit={formik.handleSubmit} spellCheck="false">
                        <InputField
                            type="text"
                            id="email"
                            name="email"
                            placeholder="."
                            value={formik.values.user}
                            label={t('login.user')}
                            require
                            touched={formik.touched.user}
                            error={formik.errors.user}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <Button type="submit" customClass={style}>
                            {t('login.forgot.forgotPassword')}
                        </Button>
                    </form>
                </div>
            </Spin>
        </main>
    );
};

export default Forgotpassword;
