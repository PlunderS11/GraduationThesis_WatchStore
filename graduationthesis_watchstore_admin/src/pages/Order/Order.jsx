import classNames from 'classnames/bind';
// import { Publish } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

import styles from './Order.module.scss';
import axiosClient from '~/api/axiosClient';
import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
// import { productData } from '../../data/dummyData.js';
// import Chart from '~/components/Chart/Chart';
// import InputField from '~/components/InputField/InputField';
// import Button from '~/components/Button/Button';

const cx = classNames.bind(styles);

export default function Order() {
    // const navigate = useNavigate();
    const params = useParams();
    const [order, setOrder] = useState({});
    const [user, setUser] = useState({});
    const [status, setStatus] = useState('');
    const [orderDetails, setOrderDetails] = useState([]);
    // const [collectionObj, setcollectionObj] = useState({});
    // const [img, setImg] = useState();
    // const [collections, setCollections] = useState([]);
    const orderId = params.orderId;

    // useEffect(() => {
    //     const getCollections = async () => {
    //         const res = await axiosClient.get('collections/allCols/');

    //         setCollections(res.data.collections);
    //     };
    //     getCollections();
    // }, []);

    useEffect(() => {
        const getProduct = async () => {
            const res = await axiosClient.get('order/admin/' + orderId);
            if (res) {
                setUser(res.data.order.user);
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
    }, []);
    console.log(order);
    //input img
    //-----------------------------------------------------------
    // const [image, setImage] = useState([]);
    // const [delImg, setDelImg] = useState([]);

    // const handleMultiFile = (e) => {
    //     setImage(e.target.files);
    //     setDelImg(Array.from(e.target.files));
    // };

    // const handleDelImg = (i) => {
    //     delImg.splice(i, 1);
    //     setDelImg([...delImg]);
    //     setImage([...delImg]);
    // };
    //-----------------------------------------------------------

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: user.username + '',
            phone: order.phone + '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Nhập tên Khách hàng'),
            phone: Yup.string().required('Nhập số điện thoại'),
        }),
        // onSubmit: async (values) => {
        //     const {
        //         name,
        //         brand,
        //         type,
        //         originalPrice,
        //         finalPrice,
        //         sex,
        //         images,
        //         collectionObj,
        //         descriptionvi,
        //         descriptionen,
        //         featuresvi,
        //         featuresen,
        //         note,
        //         sold,
        //         stock,
        //         isDelete,
        //     } = values;
        //     // console.log(values);

        //     const formData = new FormData();
        //     if (image.length > 0) {
        //         for (let i = 0; i < images.length; i++) {
        //             formData.append('images', images[i]);
        //         }
        //     }

        //     formData.append('name', name);
        //     formData.append('brand', brand);
        //     formData.append('type', type);
        //     formData.append('originalPrice', originalPrice);
        //     formData.append('finalPrice', finalPrice);
        //     formData.append('sex', sex);
        //     formData.append('collectionObj', collectionObj);
        //     formData.append('descriptionvi', descriptionvi);
        //     formData.append('descriptionen', descriptionen);
        //     formData.append('featuresvi', featuresvi.split(';'));
        //     formData.append('featuresen', featuresen.split(';'));
        //     formData.append('note', note);
        //     formData.append('sold', sold);
        //     formData.append('stock', stock);
        //     formData.append('isDelete', isDelete);

        //     // console.log(values);
        //     try {
        //         // await axiosClient.post('product/', {
        //         //     name: name,
        //         //     brand: brand,
        //         //     type: type,
        //         //     price: price,
        //         //     sex: sex,
        //         //     images: images,
        //         //     collectionName: collectionName,
        //         //     descriptionen: descriptionen,
        //         //     featuresen: featuresen.split(';'),
        //         //     sold: sold,
        //         //     stock: stock,
        //         //     createdAt: createdAt,
        //         //     updatedAt: updatedAt,
        //         //     descriptionvi: descriptionvi,
        //         //     featuresvi: featuresvi.split(';'),
        //         // });
        //         const res = await axiosClient.put('product/' + productId, formData);
        //         if (res) {
        //             toast.success('Cập nhật thành công!');
        //             navigate('/products');
        //         }
        //     } catch (error) {
        //         toast.error(error);
        //     }
        // },
    });
    const StatusName = (status) => {
        if (status === 'PENDING') {
            return 'chờ xác nhận';
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
                {/* <form className={cx('product-form')}> */}
                {/* <div className={cx('product-form-left')}> */}

                <form className={cx('add-product-form')} spellCheck="false">
                    <div className={cx('add-product-item')}>
                        <label>Thông tin khách hàng</label>
                    </div>
                    {JSON.stringify(user) !== '{}' && (
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

                    {JSON.stringify(order) !== '{}' && (
                        <div className={cx('add-product-item')}>
                            <InputField
                                customClass={styles}
                                type="textarea"
                                readonly={true}
                                id="address"
                                name="address"
                                placeholder="."
                                value={
                                    order.address +
                                    ', ' +
                                    order.addressWard.WardName +
                                    ', ' +
                                    order.addressDistrict.DistrictName +
                                    ', ' +
                                    order.addressProvince.ProvinceName
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
