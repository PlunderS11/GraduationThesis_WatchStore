import React from 'react';
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
import { setCurrentUser } from '../../features/user/userSlice';
import style from './Login.module.scss';

const cx = classNames.bind(style);

const Login = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

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
                const res = await axiosClient.post('auth/login', {
                    email: email,
                    password: password,
                });
                toast.success(t('login.success'));
                localStorage.setItem('mynhbake_token', res.data.token);
                dispatch(setCurrentUser(res.data.token));
                navigate('/');
            } catch (error) {
                toast.error(t(`login.error.${error.response.status}`));
            }
        },
    });

    return (
        <main className={cx('login-page')}>
            <div className={cx('container')}>
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
                            {t('login.forgot')}? <Link to={'/'}>{t('login.clickHere')}</Link>
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
                    <span>{t('login.dontHaveAccount')}</span> <Link to={'/register'}>{t('register.register')}</Link>
                </div>
            </div>
        </main>
    );
};

export default Login;
