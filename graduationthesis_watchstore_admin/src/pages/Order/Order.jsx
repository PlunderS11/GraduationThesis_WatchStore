import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import styles from './Order.module.scss';
import axiosClient from '~/api/axiosClient';
import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';

const cx = classNames.bind(styles);

export default function Order() {
    const params = useParams();
    const [order, setOrder] = useState({});
    const [recipient, setRecipient] = useState({});
    const [status, setStatus] = useState('');
    const [orderDetails, setOrderDetails] = useState([]);
    const [rerender, setRerender] = useState([]);

    const orderId = params.orderId;

    useEffect(() => {
        const getProduct = async () => {
            const res = await axiosClient.get('order/admin/' + orderId);
            if (res) {
                setRecipient(res.data.order.recipient);
                setStatus(res.data.order.status.state);
                setOrderDetails(res.data.order.orderDetails);
                var total_amout = 0;
                for (let i = 0; i < res.data.order.orderDetails.length; i++) {
                    total_amout += res.data.order.orderDetails[i].quantity;
                }
                res.data.order.total_amout = total_amout;
                setOrder(res.data.order);
            }
        };
        getProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rerender]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: recipient.username + '',
            phone: recipient.phone + '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Nhập tên Khách hàng'),
            phone: Yup.string().required('Nhập số điện thoại'),
        }),

        onSubmit: async (values) => {
            const { username, phone } = values;

            console.log(values);
            try {
                const res = await axiosClient.put('order/info/update/' + orderId, {
                    username: username,
                    phone: phone,
                });
                if (res) {
                    toast.success('Cập nhật thành công!');
                    setRerender(!rerender);
                }
            } catch (error) {
                toast.error(error);
            }
        },
    });
    const StatusName = (status) => {
        if (status === 'PENDING') {
            return 'Chờ xác nhận';
        } else if (status === 'PACKAGE') {
            return 'Đã xác nhận và Bắt đầu đóng gói';
        } else if (status === 'DELIVERING') {
            return 'Bắt đầu vận chuyển';
        } else if (status === 'COMPLETE') {
            return 'Đã giao';
        } else if (status === 'CANCEL') {
            return 'Đã hủy';
        }
    };

    function NumberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
    }

    return (
        <div className={cx('product')}>
            <div className={cx('product-bottom')}>
                <form onSubmit={formik.handleSubmit} className={cx('add-product-form')} spellCheck="false">
                    <div className={cx('add-product-item')}>
                        <label>Thông tin khách hàng</label>
                    </div>
                    {JSON.stringify(recipient) !== '{}' && (
                        <div className={cx('add-product-item')}>
                            <InputField
                                type="text"
                                id="username"
                                name="username"
                                placeholder="."
                                value={formik.values.username}
                                label={'Tên khách hàng'}
                                require
                                touched={formik.touched.username}
                                error={formik.errors.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                    )}

                    <div className={cx('add-product-item')}>
                        <InputField
                            type="text"
                            id="phone"
                            name="phone"
                            placeholder="."
                            value={formik.values.phone}
                            label={'Số điện thoại'}
                            require
                            touched={formik.touched.phone}
                            error={formik.errors.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    {JSON.stringify(recipient) !== '{}' && (
                        <div className={cx('add-product-item')}>
                            <InputField
                                customClass={styles}
                                type="textarea"
                                readonly={true}
                                id="address"
                                name="address"
                                placeholder="."
                                value={
                                    recipient.address +
                                    ', ' +
                                    recipient.addressWard.WardName +
                                    ', ' +
                                    recipient.addressDistrict.DistrictName +
                                    ', ' +
                                    recipient.addressProvince.ProvinceName
                                }
                                label={'Địa chỉ'}
                                require
                                onChange={formik.handleChange}
                            />
                        </div>
                    )}

                    <Button type="submit" customClass={styles}>
                        Cập nhật
                    </Button>
                </form>
            </div>
            <div className={cx('product-bottom')}>
                <div className={cx('add-product-form')}>
                    {status !== '{}' && (
                        <>
                            <div className={cx('add-product-item')}>
                                <label>
                                    Trạng thái đơn hàng: <span>{StatusName(status)}</span>
                                </label>
                            </div>

                            <table className={cx('table_time')}>
                                <tbody>
                                    <tr>
                                        <th>Quá trình</th>
                                        <th>Mốc thời gian</th>
                                    </tr>

                                    {status === 'PENDING' && (
                                        <tr>
                                            <td>Đặt hàng</td>
                                            <td>{new Date(order.dateOrdered).toLocaleString()}</td>
                                        </tr>
                                    )}
                                    {status === 'PACKAGE' && (
                                        <>
                                            <tr>
                                                <td>Đặt hàng</td>
                                                <td>{new Date(order.dateOrdered).toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td>Xác nhận & Bắt đầu đóng gói</td>
                                                <td>{new Date(order.status.packageDate).toLocaleString()}</td>
                                            </tr>
                                        </>
                                    )}
                                    {status === 'DELIVERING' && (
                                        <>
                                            <tr>
                                                <td>Đặt hàng</td>
                                                <td>{new Date(order.dateOrdered).toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td>Xác nhận & Bắt đầu đóng gói</td>
                                                <td>{new Date(order.status.packageDate).toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td>Bắt đầu vận chuyển</td>
                                                <td>{new Date(order.status.deliveringDate).toLocaleString()}</td>
                                            </tr>
                                        </>
                                    )}
                                    {status === 'COMPLETE' && (
                                        <>
                                            <tr>
                                                <td>Đặt hàng</td>
                                                <td>{new Date(order.dateOrdered).toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td>Xác nhận & Bắt đầu đóng gói</td>
                                                <td>{new Date(order.status.packageDate).toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td>Bắt đầu vận chuyển</td>
                                                <td>{new Date(order.status.deliveringDate).toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td>Nhận hàng</td>
                                                <td>{new Date(order.status.completeDate).toLocaleString()}</td>
                                            </tr>
                                        </>
                                    )}
                                    {status === 'CANCEL' && (
                                        <>
                                            <tr>
                                                <td>Đặt hàng</td>
                                                <td>{new Date(order.dateOrdered).toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td>Hủy</td>
                                                <td>{new Date(order.status.cancelDate).toLocaleString()}</td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
            <div className={cx('product-bottom')}>
                <div className={cx('add-product-form')}>
                    {JSON.stringify(orderDetails) !== '[]' && (
                        <>
                            <div className={cx('add-product-item')}>
                                <label>Chi tiết đơn hàng</label>
                            </div>

                            <table className={cx('table_orderDetail')}>
                                <tbody>
                                    <tr>
                                        <th className={cx('th_orderDetail')}>Hình ảnh</th>
                                        <th className={cx('th_orderDetail')}>Tên sản phẩm</th>
                                        <th className={cx('th_orderDetail')}>Giá bán</th>
                                        <th className={cx('th_orderDetail')}>Số lượng</th>
                                        <th className={cx('th_orderDetail')}>Thành tiền</th>
                                    </tr>
                                    {orderDetails.map((orderDetail, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className={cx('td_img_orderDetail')}>
                                                    <img
                                                        className={cx('img_orderDetail')}
                                                        src={orderDetail.product.images[0]}
                                                        alt="img"
                                                    />
                                                </td>
                                                <td className={cx('td_name_orderDetail')}>
                                                    {orderDetail.product.name}
                                                </td>
                                                <td className={cx('td_price_orderDetail')}>
                                                    {NumberWithCommas(orderDetail.product.finalPrice)}
                                                </td>
                                                <td className={cx('td_amount_orderDetail')}>{orderDetail.quantity}</td>
                                                <td className={cx('td_price_orderDetail')}>
                                                    {NumberWithCommas(
                                                        orderDetail.product.finalPrice * orderDetail.quantity,
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <table className={cx('table_orderDetail')}>
                                <tbody>
                                    <tr>
                                        <td className={cx('td_title_total_orderDetail')}>Tổng số lượng</td>
                                        <td className={cx('td_price_total_orderDetail')}>{order.total_amout}</td>
                                    </tr>
                                    <tr>
                                        <td className={cx('td_title_total_orderDetail')}>Tổng tiền hàng</td>
                                        <td className={cx('td_price_total_orderDetail')}>
                                            {NumberWithCommas(order.originalPrice)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={cx('td_title_total_orderDetail')}>Giảm giá</td>
                                        <td className={cx('td_price_total_orderDetail')}>
                                            {NumberWithCommas(order.discountPrice)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={cx('td_title_total_orderDetail')}>Tiền vận chuyển</td>
                                        <td className={cx('td_price_total_orderDetail')}>
                                            {NumberWithCommas(order.shipPrice)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={cx('td_title_total_orderDetail')}>Tổng tiền</td>
                                        <td className={cx('td_price_total_orderDetail')}>
                                            {NumberWithCommas(order.finalPrice)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
