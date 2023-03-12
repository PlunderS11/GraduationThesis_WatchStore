import React from 'react';
import classNames from 'classnames/bind';
import { Col, Row, Form, Input, DatePicker, Button } from 'antd';
import { useSelector } from 'react-redux';

import style from './Profile.module.scss';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(style);

const Profile = () => {
    const { t } = useTranslation();
    const user = useSelector(state => state.user);
    const handleUpdate = async value => {
        value['birthdate'] = value['birthdate'].format('YYYY-MM-DD');
        // try {
        //     await updateAccountInfo(value['username'], value['email'], value['birthdate']);
        // } catch (error) {
        //     console.log(error);
        // }
    };
    return (
        <div className={cx('profile-page')}>
            <div className={cx('title')}>
                <h4 style={{ fontWeight: '700', fontSize: '20px' }}>{t('accountInfo.updateInfor')}</h4>
            </div>
            {user.isLogin && (
                <div className={cx('body')}>
                    <h4 style={{ fontWeight: '700', marginBottom: '4px' }}>{t('accountInfo.generalInfo')}</h4>

                    <Form
                        name="account-info"
                        initialValues={{ remember: true }}
                        autoComplete="off"
                        layout="vertical"
                        className={cx('account-form')}
                        onFinish={handleUpdate}
                        style={{ width: '100%' }}
                    >
                        <Row>
                            <Col span={11}>
                                <Form.Item
                                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                                    label={t('register.username')}
                                    name="username"
                                    initialValue={user.user?.username}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                                    label="Số điện thoại"
                                    name="phone"
                                    initialValue={user.user?.phone}
                                >
                                    <Input disabled={true} />
                                </Form.Item>
                                <Form.Item
                                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                                    label="Ngày sinh"
                                    name="birthdate"
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                                <div className={cx('social')}>
                                    <span>Liên kết tài khoản với</span>
                                    <div style={{ width: '45px', height: '45px' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path
                                                fill="blue"
                                                d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        style={{
                                            marginTop: '3rem',
                                            backgroundColor: '#000',
                                            alignItems: 'center',
                                        }}
                                        htmlType="submit"
                                    >
                                        Lưu
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col span={2}></Col>
                            <Col span={11}>
                                <Form.Item
                                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                                    label="Giới tính"
                                    name="gender"
                                    initialValue={user.user?.sex}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item style={{ fontSize: '20px', fontWeight: 'bold' }} label="Email" name="email">
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                                    label="Mã giới thiệu"
                                    name="introduce"
                                    initialValue="PHUCBMD"
                                >
                                    <Input disabled={true} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            )}
        </div>
    );
};

export default Profile;
