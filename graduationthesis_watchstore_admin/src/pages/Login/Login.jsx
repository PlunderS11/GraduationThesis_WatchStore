import React from 'react';
import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import axiosClient from '~/api/axiosClient';
import { setCurrentUser } from '~/features/user/userSlice';
import style from './Login.module.scss';

const cx = classNames.bind(style);

const Login = () => {
    const dispatch = useDispatch();
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
        onSubmit: async (values) => {
            const { email, password } = values;
            try {
                const res = await axiosClient.post('auth/login', {
                    email: email,
                    password: password,
                });

                console.log(values);

                toast.success('Đăng nhập thành công!');
                localStorage.setItem('mynhbake_token', res.data.token);
                dispatch(setCurrentUser(res.data.token));
                navigate('/');
            } catch (error) {
                toast.error(`${error.response.status}`);
            }
        },
    });

    return (
        <div className={cx('container')}>
            <h2 className={cx('title')}>ĐĂNG NHẬP ADMIN</h2>

            <form onSubmit={formik.handleSubmit} spellCheck="false">
                <InputField
                    type="text"
                    id="email"
                    name="email"
                    placeholder="."
                    value={formik.values.user}
                    label={'Tên đăng nhập'}
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
                    label={'Mật khẩu'}
                    require
                    touched={formik.touched.password}
                    error={formik.errors.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <Button type="submit" customClass={style}>
                    Login
                </Button>
            </form>
        </div>
    );
};

export default Login;
