import React, { useState } from 'react';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import axiosClient from '../../api/axiosClient';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import { setTokenUser } from '../../features/user/userSlice';
import style from './Login.module.scss';
import { Input, Modal, Spin } from 'antd';
import MyBreadcrumb from '../../components/Breadcrumb/MyBreadcrumb';

const cx = classNames.bind(style);

const Login = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [visibleModalRegister, setVisibleModalRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [userId, setUserId] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            remember: false,
        },
        validationSchema: Yup.object({
            email: Yup.string().required('login.userError'),
            password: Yup.string().required('login.passwordError'),
        }),
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async values => {
            const { email, password } = values;
            try {
                setLoading(true);
                const res = await axiosClient.post('auth/login', {
                    email: email,
                    password: password,
                });
                if (res.status === 210) {
                    toast.error(t(`login.error.${res.status}`));
                    setUserId(res.data.userId);
                    setVisibleModalRegister(true);
                } else {
                    toast.success(t('login.success'));
                    await localStorage.setItem('mynhbake_token', res.data.token);
                    dispatch(setTokenUser(res.data.token));
                    navigate('/');
                }
            } catch (error) {
                toast.error(t(`login.error.${error.response.status}`));
            } finally {
                setLoading(false);
            }
        },
    });

    const handleVerifyOTP = async () => {
        try {
            const res = await axiosClient.post('auth/verifyOTP', {
                userId,
                otp,
            });
            toast.success(t('register.success'));
            await localStorage.setItem('mynhbake_token', res.data.token);
            dispatch(setTokenUser(res.data.token));
            navigate('/');
        } catch (error) {
            const errorCode = error.response.data.status.toString();
            toast.error(t(`register.error.${errorCode}`));
        }
    };

    return (
        <main className={cx('login-page')}>
            <Spin spinning={loading}>
                <div className="container">
                    <MyBreadcrumb />
                    <div className={cx('container')}>
                        <Modal
                            title={t('register.modal.title')}
                            open={visibleModalRegister}
                            onOk={handleVerifyOTP}
                            onCancel={() => setVisibleModalRegister(false)}
                        >
                            <Input
                                placeholder={t('register.modal.input')}
                                allowClear
                                onChange={e => setOtp(e.target.value)}
                            />
                        </Modal>
                        <h2 className={cx('title')}>{t('login.login')}</h2>
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
                            <InputField
                                type="password"
                                id="password"
                                name="password"
                                placeholder="."
                                value={formik.values.password}
                                label={t('login.password')}
                                require
                                touched={formik.touched.password}
                                error={formik.errors.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <div className={cx('options')}>
                                <div className={cx('remember')}>
                                    <label htmlFor="remember">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            name="remember"
                                            checked={formik.values.remember}
                                            onChange={formik.handleChange}
                                        />
                                        <span className={cx('checkmark')}></span>
                                        {t('login.remember')}
                                    </label>
                                </div>
                                <div className={cx('forgot')}>
                                    {t('login.forgot.forgotPassword')}?{' '}
                                    <Link to={'/forgot-password'}>{t('login.clickHere')}</Link>
                                </div>
                            </div>
                            <Button type="submit" customClass={style}>
                                {t('login.login')}
                            </Button>
                        </form>
                        <div className={cx('login-with')}>
                            <span>{t('login.orLogin')}</span>
                        </div>
                        <div className={cx('login-with-buttons')}>
                            <Button customClass={style}>
                                <FontAwesomeIcon icon={faFacebookF} className={cx('icon')} />
                                <span className={cx('text')}>Facebook</span>
                            </Button>
                            <Button customClass={style}>
                                <FontAwesomeIcon icon={faGoogle} className={cx('icon')} />
                                <span className={cx('text')}>Google</span>
                            </Button>
                        </div>
                        <div className={cx('register')}>
                            <span>{t('login.dontHaveAccount')}</span>{' '}
                            <Link to={'/register'}>{t('register.register')}</Link>
                        </div>
                    </div>
                </div>
            </Spin>
        </main>
    );
};

export default Login;
