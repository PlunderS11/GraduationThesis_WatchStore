import React, { useEffect, useState } from 'react';
import { Col, Row, Form, Input, Button, Select } from 'antd';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import axiosClient, { GHN } from '../../../api/axiosClient';

import style from './Address.module.scss';
import classNames from 'classnames/bind';
import { fetchUserInfor } from '../../../features/user';
const cx = classNames.bind(style);

const Address = () => {
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
        };
        const handleGetAddressProvince = async () => {
            const resP = await GHN.post('master-data/province');
            setProvince(resP.data);
        };
        getUserInfor();
        handleGetAddressProvince();
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
                                label="Quận / Huyện"
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
                                label="Phường / Xã"
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
                                label="Địa chỉ"
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
                                    {user.user.address?.address ? 'Cập nhật' : 'Lưu'}
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
