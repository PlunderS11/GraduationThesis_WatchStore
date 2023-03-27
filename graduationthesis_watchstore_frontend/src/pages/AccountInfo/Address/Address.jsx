import React, { useEffect, useState } from 'react';
import { Col, Row, Form, Input, Button, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient, { GHN } from '../../../api/axiosClient';
import { useSelector } from 'react-redux';

import style from './Address.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(style);

const Address = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const { state } = useLocation();
    const [loading, setLoading] = useState(false);
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState([]);
    const [form] = useForm();

    console.log(user);
    useEffect(() => {
        if (user.user.address?.address !== undefined) {
            form.setFieldValue({
                username: user.user.address.name,
                phone: user.user.address.phone,
                province: user.user.address.province.ProvinceID,
                district: user.user.address.district.DistrictID,
                ward: user.user.address.ward.WardCode,
            });
        }
        const handleGetAddressProvince = async () => {
            const resP = await GHN.post('master-data/province');
            setProvince(resP.data);
            if (user.user.address?.address) {
                const resD = await GHN.post('master-data/district', {
                    province_id: user.user.address.province.ProvinceID,
                });
                const resW = await await GHN.post('master-data/ward', {
                    district_id: user.user.address.district.DistrictID,
                });
                setDistrict(resD.data);
                setWard(resW.data);
            }
        };
        handleGetAddressProvince();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    console.log(district);

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
            });
            toast.success('Cập nhật địa chỉ thành công');
            state &&
                setTimeout(() => {
                    navigate(-1);
                }, 500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('profile__info')}>
            <div className={cx('profile__info-title')}>
                <h4 style={{ fontWeight: '700', fontSize: '20px' }}>Cập nhật thông tin</h4>
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
                        <Col span={18}>
                            <Form.Item
                                style={{ fontSize: '25px', fontWeight: 'bold' }}
                                label="Họ tên"
                                name="username"
                                rules={[{ required: true, message: 'Bắc buộc' }]}
                            >
                                <Input placeholder="Họ tên người nhận" />
                            </Form.Item>
                            <Form.Item
                                rules={[{ required: true, message: 'Bắc buộc' }]}
                                style={{ fontSize: '20px', fontWeight: 'bold' }}
                                label="Số điện thoại"
                                name="phone"
                            >
                                <Input placeholder="Số điện thoại" />
                            </Form.Item>
                            <Form.Item
                                rules={[{ required: true, message: 'Bắc buộc' }]}
                                style={{ fontSize: '20px', fontWeight: 'bold' }}
                                label="Tỉnh / Thành phố"
                                name="province"
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear
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
                                label="Quận / Huyện"
                                name="district"
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear
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
                                label="Phường / Xã"
                                name="ward"
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear
                                    options={ward.map(item => ({
                                        value: item.WardCode,
                                        label: item.WardName,
                                    }))}
                                ></Select>
                            </Form.Item>
                            <Form.Item
                                rules={[{ required: true, message: 'Bắc buộc' }]}
                                style={{ fontSize: '20px', fontWeight: 'bold' }}
                                label="Địa chỉ"
                                name="address"
                            >
                                <Input placeholder="Số nhà, tên đường" />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    style={{
                                        backgroundColor: '#47991f',
                                        height: '100%',
                                        padding: '7px 16px',
                                    }}
                                    htmlType="submit"
                                    loading={loading}
                                >
                                    {user.user.address ? 'Cập nhật' : 'Lưu'}
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default Address;
