import { Col, Form, Input, Row, Spin, Button } from 'antd';
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import style from './ChangePassword.module.scss';
import axiosClient from '../../../api/axiosClient';
import { toast } from 'react-toastify';
import i18next from 'i18next';

const cx = classNames.bind(style);

const ChangePassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async value => {
        setLoading(true);
        try {
            await axiosClient.put(`auth/changepassword/${user.user._id}`, {
                password: value.oldPassword,
                newPassword: value.newPassword,
                lang: i18next.language,
            });
            toast.success(t('accountInfo.updateSuccess'));
        } finally {
            form.resetFields();
            navigate('/login');
            setLoading(false);
        }
    };

    return (
        <Spin spinning={loading}>
            <div className={cx('profile__info')}>
                <div className={cx('profile__info-title')}>
                    <h4 style={{ fontWeight: '700', fontSize: '20px' }}>{t('changePassword.changePassword')}</h4>
                </div>
                <div className={cx('profile__info-body')}>
                    <Form
                        form={form}
                        name="account-info"
                        initialValues={{ remember: true }}
                        autoComplete="off"
                        layout="vertical"
                        onFinish={handleChangePassword}
                        className="account-form"
                        style={{ width: '100%' }}
                    >
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    style={{ fontSize: '25px', fontWeight: 'bold' }}
                                    label={t('changePassword.oldPassword')}
                                    name="oldPassword"
                                    rules={[{ required: true, message: 'Bắc buộc' }]}
                                >
                                    <Input.Password placeholder={t('changePassword.oldPassword')} />
                                </Form.Item>
                                <Form.Item
                                    rules={[{ required: true, message: 'Bắc buộc' }]}
                                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                                    label={t('changePassword.newPassword')}
                                    name="newPassword"
                                >
                                    <Input.Password placeholder={t('changePassword.newPassword')} />
                                </Form.Item>
                                <Form.Item
                                    rules={[
                                        { required: true, message: 'Bắc buộc' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('newPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    new Error(t('changePassword.errorConfirmPassword'))
                                                );
                                            },
                                        }),
                                    ]}
                                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                                    label={t('changePassword.confirmNewPassword')}
                                    name="confirmNewPassword"
                                >
                                    <Input.Password placeholder={t('changePassword.confirmNewPassword')} />
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        style={{
                                            backgroundColor: '#3d464d',
                                            height: '100%',
                                            padding: '7px 16px',
                                        }}
                                        htmlType="submit"
                                        loading={loading}
                                    >
                                        {t('button.update')}
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </Spin>
    );
};

export default ChangePassword;
