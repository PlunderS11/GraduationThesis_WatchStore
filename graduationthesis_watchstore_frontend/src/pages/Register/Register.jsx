import React from 'react';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';

import axiosClient from '../../api/axiosClient';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import { setCurrentUser } from '../../features/user/userSlice';
import style from './Register.module.scss';

const cx = classNames.bind(style);

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            email: '',
            phone: '',
            username: '',
            address: '',
            password: '',
            confirmPassword: '',
            accept: false,
        },
        validationSchema: Yup.object({
            email: Yup.string().email('register.invalidEmail').required('register.requiredEmail'),
            username: Yup.string().required('register.requiredName'),
            password: Yup.string().required('register.requiredPassword').min(8, 'register.minPassword'),
            confirmPassword: Yup.string()
                .required('register.requiredConfirmPassword')
                .oneOf([Yup.ref('password')], 'register.confirmPasswordError'),
            accept: Yup.boolean().oneOf([true], 'register.requiredAccept'),
        }),
        onSubmit: async values => {
            const { email, username, password } = values;
            try {
                const res = await axiosClient.post('auth/register', {
                    username: username,
                    email: email,
                    password: password,
                });
                toast.success(t('register.success'));
                localStorage.setItem('mynhbake_token', res.data.token);
                dispatch(setCurrentUser(res.data.token));
                navigate('/');
            } catch (error) {
                const errorCode = error.response.data.code.toString();
                toast.error(t(`register.error.${errorCode}`));
            }
        },
    });

    return (
        <main className={cx('register-page')}>
            <div className={cx('container')}>
                <h2 className={cx('title')}>{t('register.register')}</h2>
                <form spellCheck="false" onSubmit={formik.handleSubmit}>
                    <InputField
                        type="text"
                        id="email"
                        name="email"
                        placeholder="."
                        value={formik.values.email}
                        label="Email"
                        require
                        touched={formik.touched.email}
                        error={formik.errors.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <InputField
                        type="text"
                        id="username"
                        name="username"
                        placeholder="."
                        value={formik.values.username}
                        label={t('register.username')}
                        require
                        touched={formik.touched.username}
                        error={formik.errors.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <InputField
                        type="password"
                        id="password"
                        name="password"
                        placeholder="."
                        value={formik.values.password}
                        label={t('register.password')}
                        require
                        touched={formik.touched.password}
                        error={formik.errors.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <InputField
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="."
                        value={formik.values.confirmPassword}
                        label={t('register.confirmPassword')}
                        require
                        touched={formik.touched.confirmPassword}
                        error={formik.errors.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <div className={cx('accept')}>
                        <label htmlFor="accept">
                            <input
                                type="checkbox"
                                name="accept"
                                id="accept"
                                checked={formik.values.accept}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <span className={cx('checkmark')}></span>
                            <span>{t('register.accept')}</span>
                        </label>
                        {formik.touched.accept && formik.errors.accept && (
                            <span className={cx('form-error')}>{t('register.requiredAccept')}</span>
                        )}
                    </div>
                    <Button type="submit" customClass={style}>
                        {t('register.register')}
                    </Button>
                </form>
                <div className={cx('login')}>
                    <span>{t('register.haveAccount')}</span> <Link to={'/login'}>{t('login.login')}</Link>
                </div>
            </div>
        </main>
    );
};

export default Register;
