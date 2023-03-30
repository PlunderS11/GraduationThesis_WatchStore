import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import * as moment from 'moment';
import { DatePicker, Select } from 'antd';
import { toast } from 'react-toastify';

import styles from './OrderList.module.scss';
// import GridMultiFilter from '~/components/GridMultiFilter/GridMultiFilter';
import axiosClient from '~/api/axiosClient';
import Button from '~/components/Button/Button';
import Grid from '~/components/Grid/Grid';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const { RangePicker } = DatePicker;

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [rerender, setRerender] = useState(false);
    useEffect(() => {
        const getProducts = async () => {
            const res = await axiosClient.get('order/admin');
            setOrders(res.data.orderList);
            if (res) {
                const oders_list = res.data.orderList;

                for (let i = 0; i < oders_list.length; i++) {
                    var total_amount = 0;
                    var oderdetails_list = oders_list[i].orderDetails;
                    for (let j = 0; j < oderdetails_list.length; j++) {
                        total_amount += oderdetails_list[j].quantity;
                    }
                    oders_list[i].total_amount = total_amount;
                }
                setOrders(oders_list);
            }
        };
        getProducts();
    }, [rerender]);

    const ButtonStatus = ({ type, children }) => {
        var title = '';
        if (children === 'PENDING') {
            title = 'Chờ xác nhận';
        } else if (children === 'PACKAGE') {
            title = 'Đóng gói';
        } else if (children === 'DELIVERING') {
            title = 'Đang vận chuyển';
        } else if (children === 'COMPLETE') {
            title = 'Đã giao';
        } else if (children === 'CANCEL') {
            title = 'Đã hủy';
        }
        return <button className={cx('button-cell', type)}>{title}</button>;
    };

    const ButtonPeymentStatus = ({ type, children }) => {
        var title = '';
        if (children === 'PENDING') {
            title = 'Chờ thanh toán';
        } else {
        }
        return <button className={cx('button-cell', type)}>{title}</button>;
    };

    const handleChangeOrderStatus = async (value, code) => {
        // console.log(`selected ${value} ${code}`);
        try {
            const res = await axiosClient.put('order/status/update/' + code, {
                status: value,
            });
            if (res) {
                setRerender(!rerender);
                toast.success('Cập nhật trạng thái đơn hàng thành công!');
            }
        } catch (error) {
            toast.error(error);
        }
    };

    function NumberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
    }

    const columns = [
        {
            field: '_orders',
            headerName: 'Mã đơn',
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            width: 200,
            filterable: false,
            sortable: false,
            renderCell: (params) => {
                var disable = false;
                if (params.row.status.state === 'CANCEL') {
                    disable = true;
                }
                // console.log(disable);
                return (
                    <div className={cx('order-code')}>
                        <ul className={cx('ul-text')}>
                            <li>{params.row.code}</li>
                            <li>
                                <ButtonStatus type={params.row.status.state} children={params.row.status.state} />
                            </li>
                            <li>
                                <Select
                                    className={cx('select-cell')}
                                    defaultValue={params.row.status.state}
                                    onChange={(value) => handleChangeOrderStatus(value, params.row._id)}
                                    disabled={disable}
                                    options={[
                                        {
                                            value: 'PENDING',
                                            label: 'Chờ xác nhận',
                                        },
                                        {
                                            value: 'PACKAGE',
                                            label: 'Đóng gói',
                                        },
                                        {
                                            value: 'DELIVERING',
                                            label: 'Đang vận chuyển',
                                        },
                                        {
                                            value: 'COMPLETE',
                                            label: 'Đã giao',
                                        },
                                        {
                                            value: 'CANCEL',
                                            label: 'Đã hủy ',
                                        },
                                    ]}
                                />
                            </li>
                        </ul>
                    </div>
                );
            },
        },
        {
            field: 'orders',
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            headerName: 'Khách hàng',
            width: 300,
            filterable: false,
            sortable: false,
            renderCell: (params) => {
                return (
                    <div className={cx('order-code')}>
                        <ul>
                            <li>
                                <label className={cx('label-cell')}>Họ tên: </label>
                                <span>{params.row.recipient.username}</span>
                            </li>
                            <li>
                                <label className={cx('label-cell')}>SĐT: </label>
                                <span>{params.row.recipient.phone}</span>
                            </li>
                            <li>
                                <label className={cx('label-cell')}>Địa chỉ: </label>
                                <span className={cx('address')}>
                                    {params.row.recipient.address}, <br /> {params.row.recipient.addressWard.WardName},
                                    {params.row.recipient.addressDistrict.DistrictName},<br />{' '}
                                    {params.row.recipient.addressProvince.ProvinceName}
                                </span>
                            </li>
                        </ul>
                    </div>
                );
            },
        },
        {
            field: 'orders2',
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            headerName: 'Tổng tiền',
            width: 300,
            filterable: false,
            sortable: false,
            renderCell: (params) => {
                return (
                    <div className={cx('order-code-number')}>
                        <ul className={cx('ul-cell')}>
                            <li className={cx('li-cell')}>
                                <label className={cx('label-cell')}>Tổng số lượng: </label>
                                <span className={cx('number-cell')}>{params.row.total_amount}</span>
                            </li>
                            <li className={cx('li-cell')}>
                                <label className={cx('label-cell')}>Tổng tiền hàng: </label>
                                <span className={cx('number-cell')}>{NumberWithCommas(params.row.originalPrice)}</span>
                            </li>
                            <li className={cx('li-cell')}>
                                <label className={cx('label-cell')}>Giảm giá: </label>
                                <span className={cx('number-cell')}>{NumberWithCommas(params.row.discountPrice)}</span>
                            </li>
                            <li className={cx('li-cell')}>
                                <label className={cx('label-cell')}>Tiền vận chuyển: </label>
                                <span className={cx('number-cell')}>{NumberWithCommas(params.row.shipPrice)}</span>
                            </li>
                            <li className={cx('li-cell')}>
                                <label className={cx('label-cell')}>Tổng tiền: </label>
                                <span className={cx('number-cell')}>{NumberWithCommas(params.row.finalPrice)}</span>
                            </li>
                        </ul>
                    </div>
                );
            },
        },
        {
            field: 'orders1',
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            headerName: 'Thanh toán',
            width: 200,
            filterable: false,
            sortable: false,
            renderCell: (params) => {
                var typePay = '';
                if (params.row.paymentType === 'CASH') {
                    typePay = 'Tiền mặt';
                }
                return (
                    <div className={cx('order-code')}>
                        <ul className={cx('ul-text')}>
                            <li>
                                <span>{typePay}</span>
                            </li>
                            <li>
                                <ButtonPeymentStatus
                                    type={params.row.paymentStatus}
                                    children={params.row.paymentStatus}
                                />
                            </li>
                            <li>
                                <Select
                                    className={cx('select-cell')}
                                    defaultValue={params.row.paymentStatus}
                                    options={[
                                        {
                                            value: 'PENDING',
                                            label: 'Chờ thanh toán',
                                        },
                                        {
                                            value: 'COMPLETE',
                                            label: 'Hoàn thành',
                                        },
                                        {
                                            value: 'CANCEL',
                                            label: 'Thất bại',
                                        },
                                    ]}
                                />
                            </li>
                        </ul>
                    </div>
                );
            },
        },
        {
            field: 'dateOrdered',
            headerClassName: 'super-app-theme--header',
            align: 'center',
            headerAlign: 'center',
            headerName: 'Ngày tạo',
            sortable: false,
            width: 150,
            type: 'date',
            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },
        {
            field: 'action',
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            headerName: 'Hành động',
            width: 120,
            filterable: false,
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={'/order/' + params.row._id}>
                            <button className={cx('product-list-edit')}>Chi tiết</button>
                        </Link>
                    </>
                );
            },
        },
    ];

    return (
        <div className={cx('product-list')}>
            <label className={cx('label')}>DANH SÁCH ĐƠN HÀNG</label>
            <div className={cx('header')}>
                <ul>
                    <li className={cx('li')}>
                        <label>Chọn ngày: </label>
                        <RangePicker className={cx('input_antd_date')} />

                        <label>Mã đơn: </label>
                        <input className={cx('input')} type="text" placeholder="Nhập mã đơn" />

                        <label>Trạng thái đơn: </label>
                        <Select
                            className={cx('input_antd')}
                            placeholder="Trạng thái đơn"
                            // onChange={onChange}
                            // onSearch={onSearch}

                            options={[
                                {
                                    value: '',
                                    label: 'Tất cả',
                                },
                                {
                                    value: 'PACKAGE',
                                    label: 'Đóng gói',
                                },
                                {
                                    value: 'PENDING',
                                    label: 'Chờ xác nhận',
                                },
                                {
                                    value: 'DELIVERING',
                                    label: 'Đang vận chuyển',
                                },
                                {
                                    value: 'COMPLETE',
                                    label: 'Đã giao',
                                },
                                {
                                    value: 'CANCEL',
                                    label: 'Đã hủy ',
                                },
                            ]}
                        />
                    </li>
                    <li className={cx('li')}>
                        <label>Tỉnh thành: </label>
                        <Select
                            className={cx('input_antd')}
                            showSearch
                            placeholder="Tỉnh thành"
                            optionFilterProp="children"
                            // onChange={onChange}
                            // onSearch={onSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={[
                                {
                                    value: '',
                                    label: 'Tất cả',
                                },
                            ]}
                        />

                        <label>Quận huyện: </label>
                        <Select
                            className={cx('input_antd')}
                            showSearch
                            placeholder="Quận huyện"
                            optionFilterProp="children"
                            // onChange={onChange}
                            // onSearch={onSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={[
                                {
                                    value: '',
                                    label: 'Tất cả',
                                },
                            ]}
                        />

                        <label>Phường xã: </label>
                        <Select
                            className={cx('input_antd')}
                            showSearch
                            placeholder="Phường xã"
                            optionFilterProp="children"
                            // onChange={onChange}
                            // onSearch={onSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={[
                                {
                                    value: '',
                                    label: 'Tất cả',
                                },
                            ]}
                        />

                        <Button customClass={styles}>Tiềm kiếm</Button>
                        <Button customClass={styles}>Xuất excel</Button>
                    </li>
                </ul>
            </div>

            <div className={cx('grid')}>
                <Grid datas={orders} headers={columns} rowHeight={150} pagesize={10} hideToolbar={true} />
            </div>
        </div>
    );
}
