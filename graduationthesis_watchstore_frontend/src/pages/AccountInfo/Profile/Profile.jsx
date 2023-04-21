import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import { Col, Row, Form, Input, Button, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import style from './Profile.module.scss';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import { fetchUserInfor } from '../../../features/user/useThunk';

const cx = classNames.bind(style);

const Profile = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const user = useSelector(state => state.user);
    const loading = useSelector(state => state.user.isLoadingUser);

    useEffect(() => {
        dispatch(fetchUserInfor());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (user.isLogin) {
            form.setFieldsValue({
                username: user.user?.username,
                phone: user.user?.phone,
                gender: user.user?.sex === 'm' ? t('header.man') : t('header.woman'),
                email: user.user?.email,
                rank: user.user?.rank?.[`name${i18n.language}`],
            });
        }
    }, [user, t, form]);
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
            <Spin spinning={loading}>
                <div className={cx('body')}>
                    <h4 style={{ fontWeight: '700', marginBottom: '4px' }}>{t('accountInfo.generalInfo')}</h4>
                    <Form
                        name="account-info"
                        initialValues={{ remember: true }}
                        autoComplete="off"
                        layout="vertical"
                        className={cx('account-form')}
                        onFinish={handleUpdate}
                        form={form}
                        style={{ width: '100%' }}
                    >
                        <Row>
                            <Col span={11}>
                                <Form.Item
                                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                                    label={t('register.username')}
                                    name="username"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                                    label={t('register.phone')}
                                    name="phone"
                                >
                                    <Input disabled={true} />
                                </Form.Item>
                                <Form.Item
                                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                                    label={t('register.rank')}
                                    name="rank"
                                >
                                    <Input disabled={true} style={{ width: '100%' }} />
                                </Form.Item>
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
                                    label={t('register.sex')}
                                    name="gender"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item style={{ fontSize: '20px', fontWeight: 'bold' }} label="Email" name="email">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Spin>
        </div>
    );
};

export default Profile;
