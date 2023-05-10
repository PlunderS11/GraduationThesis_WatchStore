import React, { useEffect, useState } from 'react';
import { Col, Row, Form, Input, Button, Select, Spin } from 'antd';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import axiosClient, { GHN } from '../../../api/axiosClient';

import style from './Address.module.scss';
import classNames from 'classnames/bind';
import { fetchUserInfor } from '../../../features/user';
import { useTranslation } from 'react-i18next';
const cx = classNames.bind(style);

const Address = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { state } = useLocation();
    const [loading, setLoading] = useState(false);
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const getUserInfor = async () => {
            try {
                setLoading(true);
                dispatch(fetchUserInfor);
                const res = await axiosClient.get('user/userInfo');
                if (res.data.address?.address !== undefined) {
                    form.setFieldsValue({
                        username: res.data.address.name,
                        phone: res.data.address.phone,
                        province: res.data.address.province.ProvinceID,
                        district: res.data.address.district.DistrictID,
                        ward: res.data.address.ward.WardCode,
                        address: res.data.address.address,
                    });
                    const resD = await GHN.post('master-data/district', {
                        province_id: res.data.address.province.ProvinceID,
                    });
                    const resW = await await GHN.post('master-data/ward', {
                        district_id: res.data.address.district.DistrictID,
                    });
                    setDistrict(resD.data);
                    setWard(resW.data);
                }
                // getProvince
                const resP = await GHN.post('master-data/province');
                setProvince(resP.data);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };
        getUserInfor();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGetAddressDistrict = async value => {
        const res = await GHN.post('master-data/district', {
            province_id: value,
        });
        setDistrict(res.data);
        setWard([]);
        form.setFieldValue('district', '');
        form.setFieldValue('ward', '');
    };

    const handleGetAddressWard = async value => {
        const res = await GHN.post('master-data/ward', {
            district_id: value,
        });
        setWard(res.data);
        form.setFieldValue('ward', '');
    };

    const handleUpdate = async value => {
        try {
            setLoading(true);
            const resProvince = province.find(item => item.ProvinceID === value.province);
            const resDistrict = district.find(item => item.DistrictID === value.district);
            const resWard = ward.find(item => item.WardCode === value.ward);

            await axiosClient.put(`user/${user.user._id}`, {
                address: {
                    address: value.address,
                    province: resProvince,
                    district: resDistrict,
                    ward: resWard,
                    name: value.username,
                    phone: value.phone,
                },
                phone: value.phone,
            });
            toast.success(t('accountInfo.updateSuccess'));
            state &&
                setTimeout(() => {
                    navigate(-1);
                }, 500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Spin spinning={loading}>
            <div className={cx('profile__info')}>
                <div className={cx('profile__info-title')}>
                    <h4 style={{ fontWeight: '700', fontSize: '20px' }}>{t('accountInfo.updateInfor')}</h4>
                </div>
                <div className={cx('profile__info-body')}>
                    <Form
                        form={form}
                        name="account-info"
                        initialValues={{ remember: true }}
                        autoComplete="off"
                        layout="vertical"
                        onFinish={handleUpdate}
                        className="account-form"
                        style={{ width: '100%' }}
                    >
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    style={{ fontSize: '25px', fontWeight: 'bold' }}
                                    label={t('checkout.name')}
                                    name="username"
                                    rules={[{ required: true, message: 'Bắc buộc' }]}
                                >
                                    <Input placeholder={t('checkout.name')} />
                                </Form.Item>
                                <Form.Item
                                    rules={[{ required: true, message: 'Bắc buộc' }]}
                                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                                    label={t('checkout.phone')}
                                    name="phone"
                                >
                                    <Input placeholder={t('checkout.phone')} />
                                </Form.Item>
                                <Form.Item
                                    rules={[{ required: true, message: 'Bắc buộc' }]}
                                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                                    label={t('checkout.selectCityOption')}
                                    name="province"
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        allowClear
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        onChange={handleGetAddressDistrict}
                                        options={province.map((item, i) => ({
                                            value: item.ProvinceID,
                                            label: item.NameExtension[1],
                                        }))}
                                    ></Select>
                                </Form.Item>
                                <Form.Item
                                    rules={[{ required: true, message: 'Bắc buộc' }]}
                                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                                    label={t('checkout.selectDistrictOption')}
                                    name="district"
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        allowClear
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        onChange={handleGetAddressWard}
                                        options={district.map(item => ({
                                            value: item.DistrictID,
                                            label: item.DistrictName,
                                        }))}
                                    ></Select>
                                </Form.Item>
                                <Form.Item
                                    rules={[{ required: true, message: 'Bắc buộc' }]}
                                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                                    label={t('checkout.selectWardOption')}
                                    name="ward"
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        allowClear
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={ward.map(item => ({
                                            value: item.WardCode,
                                            label: item.WardName,
                                        }))}
                                    ></Select>
                                </Form.Item>
                                <Form.Item
                                    rules={[{ required: true, message: 'Bắc buộc' }]}
                                    style={{ fontSize: '20px', fontWeight: 'bold' }}
                                    label={t('checkout.address')}
                                    name="address"
                                >
                                    <Input placeholder="Số nhà, tên đường" />
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
                                        {user.user.address?.address ? t('button.update') : t('button.save')}
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

export default Address;
