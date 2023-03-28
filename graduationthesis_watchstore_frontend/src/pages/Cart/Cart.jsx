import React, { useState } from 'react';
import { Col, Modal, Table } from 'antd';
import ImageCustom from '../../components/ImageCustom/ImageCustom';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import style from './Cart.module.scss';

import Button from '../../components/Button/Button';
import { NumberWithCommas } from '../../functions';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectTotalItems } from '../../features/cart';
import Column from 'antd/es/table/Column';

const cx = classNames.bind(style);

const Cart = () => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const products = useSelector(selectCartItems);
    const totalItems = useSelector(selectTotalItems);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coupon, setCoupon] = useState('');

    const handleRemoveCart = async e => {};

    const handleIncrease = async id => {};

    const handleDecrease = async id => {};

    // Apply discount code
    const handleOk = async () => {
        setIsModalOpen(false);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={cx('cart-page')}>
            <div className="page-header">
                <div className="container">
                    <div className="page-header-container">
                        <div className="page-header__title"></div>
                    </div>
                </div>
            </div>
            {totalItems > 0 ? (
                <div className="page">
                    <div className="container">
                        <div className={cx('product')}>
                            <Table rowKey="id" dataSource={products} pagination={{ position: [] }}>
                                <Column
                                    title="Hình ảnh"
                                    align="center"
                                    render={(value, record, index) => (
                                        <div style={{ width: '80px' }}>
                                            <Link
                                                to={`shop/products/${record.product._id}`}
                                                className={cx('product-image')}
                                            >
                                                <ImageCustom src={record.product.images[0]} />
                                            </Link>
                                        </div>
                                    )}
                                />
                                <Column
                                    title="Sản phẩm"
                                    render={(value, record, index) => (
                                        <div className={cx('product-info')}>
                                            <Link to={`shop/products/${record.product._id}`}>
                                                {record.product.name}
                                            </Link>
                                        </div>
                                    )}
                                />
                                <Column
                                    title="Đơn giá"
                                    align="right"
                                    render={(value, record, index) => (
                                        <span>{NumberWithCommas(record.product.finalPrice)}&nbsp;₫</span>
                                    )}
                                />
                                <Column
                                    title="Số lượng"
                                    align="center"
                                    dataIndex={'quantity'}
                                    render={(text, record, index) => {
                                        return (
                                            <div className={cx('action__btnCount')} style={{ marginLeft: '22%' }}>
                                                <div
                                                    className={cx('btnCount-btnSub')}
                                                    onClick={() => text > 1 && handleDecrease(record.product)}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 448 512"
                                                        width={15}
                                                        height={15}
                                                    >
                                                        <path d="M416 256c0 17.7-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id={String(index)}
                                                    type="text"
                                                    className={cx('btnCount-input')}
                                                    defaultValue={text}
                                                    // value={text}
                                                />
                                                <div
                                                    className={cx('btnCount-btnAdd')}
                                                    onClick={() => handleIncrease(record.product)}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 448 512"
                                                        width={15}
                                                        height={15}
                                                    >
                                                        <path d="M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                                <Column
                                    title="Thành tiền"
                                    render={(value, record, index) => (
                                        <div>
                                            <span style={{ color: '#ff424e' }}>
                                                {NumberWithCommas(record.product.finalPrice * record.quantity)}&nbsp;₫
                                            </span>
                                        </div>
                                    )}
                                />
                                <Column
                                    title=""
                                    render={(value, record, index) => (
                                        <div>
                                            <button
                                                className={cx('menu-item-btn')}
                                                onClick={() => handleRemoveCart(record)}
                                            >
                                                {/* {cartStore.isLoading ? (
                                                    <LoadingOutlined />
                                                ) :  */}
                                                (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
                                                    <path d="M8.8 8.8c-.4.4-1 .4-1.4 0L5 6.4 2.6 8.8c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4L3.6 5 1.2 2.6c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0L5 3.6l2.4-2.4c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L6.4 5l2.4 2.4c.4.4.4 1 0 1.4z"></path>
                                                </svg>
                                                )
                                            </button>
                                        </div>
                                    )}
                                />
                            </Table>
                        </div>
                        <div className={cx('actions')}>
                            <div>
                                <div className={cx('address')}>
                                    <div className={cx('change')}>
                                        <span style={{ fontWeight: 600 }}>Giao tới</span>
                                        <div
                                            className={cx('change-a')}
                                            onClick={() => navigate('/account/address', { state: true })}
                                        >
                                            Thay đổi
                                        </div>
                                    </div>
                                    <div className={cx('add')}>
                                        {user.user.address?.address ? (
                                            <>
                                                <div className="address-add-phone">{`${user.user.address?.name} | ${user.user.address?.phone}`}</div>
                                                <div className="address-add-address">
                                                    {`${user.user.address?.address}, ${user.user.address?.ward.WardName}, ${user.user.address?.district.DistrictName}, ${user.user.address?.province.NameExtension[1]}`}
                                                </div>
                                            </>
                                        ) : (
                                            <Link to={'/account/addresses'}>+ Thêm địa chỉ</Link>
                                        )}
                                    </div>
                                </div>
                                {/* Modal coupon */}
                                <Modal
                                    title="Hebec Khuyến mãi"
                                    className="modal-style"
                                    open={isModalOpen}
                                    onCancel={handleCancel}
                                    footer={null}
                                >
                                    <div className={cx('modal__body')}>
                                        <div className={cx('modal__box')}>
                                            <input
                                                type="text"
                                                className={cx('modal__input')}
                                                placeholder="Nhập Mã Khuyến Mãi"
                                                value={coupon}
                                                onChange={e => setCoupon(e.target.value)}
                                            />
                                            <Button onclick={handleOk}>Áp dụng</Button>
                                        </div>
                                        <div className={cx('modal__text')}>
                                            <div className={cx('modal__label')}>Mã giảm giá</div>
                                            <span>Chưa có mã giảm giá nào!</span>
                                        </div>
                                    </div>
                                </Modal>
                                <div className={cx('coupon')}>
                                    <span>Hebec Khuyến Mãi</span>
                                    {5 > 0 ? (
                                        <div className={cx('coupon-chonse')}>
                                            {`Tiền khuyến mãi được giảm ${NumberWithCommas(5)}`}
                                            &nbsp;₫
                                        </div>
                                    ) : (
                                        <div className={cx('coupon-chonse')} onClick={showModal}>
                                            <img
                                                src="https://hebec.vn/images/coupon_icon.svg"
                                                alt=""
                                                style={{ marginRight: '4px' }}
                                            />
                                            Chọn hoặc nhập khuyến mãi
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className={cx('checkout')}>
                                    <div className={cx('checkout-button')}>
                                        <Button to="/hebec-shop">Tiếp tục mua sắm</Button>
                                    </div>
                                    <div className={cx('checkout-form')}>
                                        <div className={cx('checkout-form-body')}>
                                            <div className={cx('checkout-form-calculate')}>
                                                <div className={cx('checkout-form-calculate-title')}>
                                                    <span className={cx('form-calculate-title-text')}>Tạm tính</span>
                                                    <p>
                                                        {NumberWithCommas(25367)}
                                                        &nbsp;₫
                                                    </p>
                                                </div>
                                                <div className={cx('checkout-form-calculate-title')}>
                                                    <span className={cx('form-calculate-title-text')}>
                                                        Phí vận chuyển
                                                    </span>
                                                    <p>
                                                        {NumberWithCommas(6363663)}
                                                        &nbsp;₫
                                                    </p>
                                                </div>
                                                <div className={cx('checkout-form-calculate-title')}>
                                                    <span className={cx('form-calculate-title-text')}>Giảm giá</span>
                                                    <p style={{ color: '#47991f' }}>
                                                        -{NumberWithCommas(25254262)}
                                                        &nbsp;₫
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={cx('checkout-form-total')}>
                                                <h2>Tổng cộng</h2>
                                                <h2 style={{ color: '#ff424e' }}>
                                                    {NumberWithCommas(23457)}
                                                    &nbsp;₫
                                                </h2>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <Button
                                                    to="/shop/checkout"
                                                    // loading={cartStore.isLoading}
                                                >
                                                    THANH TOÁN
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={cx('page-empty')}>
                    <div className="container">
                        <div className={cx('empty-body')}>
                            <div className={cx('empty-body-image')}>
                                <svg
                                    data-v-7d63b874=""
                                    height="60"
                                    viewBox="0 0 512 512"
                                    width="60"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ margin: '0 auto' }}
                                >
                                    <path
                                        data-v-7d63b874=""
                                        d="M410.073 89.887h-68.82c-8.274 0-14.981-6.707-14.981-14.981V49.39c0-27.234 22.157-49.39 49.391-49.39s49.391 22.157 49.391 49.39v25.515c0 8.275-6.707 14.982-14.981 14.982zm-53.838-19.975h38.857V49.39c0-10.713-8.716-19.428-19.429-19.428s-19.429 8.716-19.429 19.428v20.522z"
                                        fill="#29376d"
                                    ></path>
                                    <path
                                        data-v-7d63b874=""
                                        d="M454.868 242.889H300.073c-8.27 0-14.981-6.712-14.981-14.981v-59.925c0-.12.02-.24.02-.36s-.01-.25 0-.369l4.994-92.434c.39-7.98 6.971-14.252 14.961-14.252h141.192c7.97 0 14.542 6.232 14.961 14.182l8.629 152.358c.001 9.98-6.916 15.781-14.981 15.781z"
                                        fill="#ff645a"
                                    ></path>
                                    <path
                                        data-v-7d63b874=""
                                        d="M454.868 242.889H317.781V60.568h128.478c7.97 0 14.542 6.232 14.961 14.182l8.629 152.358c.001 9.98-6.916 15.781-14.981 15.781z"
                                        fill="#ff3053"
                                    ></path>
                                    <path
                                        data-v-7d63b874=""
                                        d="M317.778 118.046v109.862c0 8.27-6.702 14.981-14.981 14.981H147.575c-9.072 0-16.115-8.036-14.831-17.088l7.019-109.862c1.049-7.381 7.371-12.874 14.831-12.874h148.203c8.279 0 14.981 6.711 14.981 14.981z"
                                        fill="#fabe2c"
                                    ></path>
                                    <circle
                                        data-v-7d63b874=""
                                        cx="395.493"
                                        cy="467.057"
                                        fill="#29376d"
                                        r="44.943"
                                    ></circle>
                                    <circle
                                        data-v-7d63b874=""
                                        cx="235.944"
                                        cy="467.057"
                                        fill="#47568c"
                                        r="44.943"
                                    ></circle>
                                    <path
                                        data-v-7d63b874=""
                                        d="M406.629 217.171c.21 4.095-1.278 8.1-4.105 11.076a15.005 15.005 0 01-10.856 4.654H243.894a15.02 15.02 0 01-10.856-4.654 15.017 15.017 0 01-4.105-11.076l2.996-59.925c.4-7.97 6.981-14.232 14.961-14.232h141.782c7.98 0 14.562 6.262 14.961 14.232z"
                                        fill="#4793ff"
                                    ></path>
                                    <path
                                        data-v-7d63b874=""
                                        d="M406.629 217.171c.21 4.095-1.278 8.1-4.105 11.076a15.005 15.005 0 01-10.856 4.654h-73.887v-89.887h70.891c7.98 0 14.562 6.262 14.961 14.232z"
                                        fill="#4756ff"
                                    ></path>
                                    <path
                                        data-v-7d63b874=""
                                        d="M488.047 221.695l-26.167 90.536c-7.041 29.423-33.068 49.957-63.34 49.957H179.625c-7.321-29.822-27.755-100.703-42.586-159.25h336.507c4.634 0 9.009 2.147 11.855 5.823a14.979 14.979 0 012.646 12.934z"
                                        fill="#dfe7f4"
                                    ></path>
                                    <path
                                        data-v-7d63b874=""
                                        d="M488.047 221.695l-26.167 90.536c-7.041 29.423-33.068 49.957-63.34 49.957h-80.758v-159.25h155.764c4.634 0 9.009 2.147 11.855 5.823a14.979 14.979 0 012.646 12.934z"
                                        fill="#b6c0d1"
                                    ></path>
                                    <circle data-v-7d63b874="" cx="235.944" cy="467.057" fill="#f0f7ff" r="15"></circle>
                                    <circle data-v-7d63b874="" cx="395.493" cy="467.057" fill="#dfe7f4" r="15"></circle>
                                    <path
                                        data-v-7d63b874=""
                                        d="M448.581 407.13c0 8.27-6.72 14.98-14.99 14.98H218.92c-27 0-50.2-18.35-56.42-44.63-5.16-18.16-3.24-11.38-61.18-242.91a14.868 14.868 0 00-14.42-11.22H38.45c-8.27 0-14.98-6.71-14.98-14.98 0-8.28 6.71-14.98 14.98-14.98H86.9c20.54 0 38.41 13.9 43.46 33.8 0 0 7.19 28.32 16.67 65.76 14.83 58.55 35.26 139.42 42.58 169.24.88 3.56 1.57 6.41 2.04 8.39 3.01 12.7 14.22 21.57 27.27 21.57h214.67c8.27 0 14.991 6.71 14.991 14.98z"
                                        fill="#47568c"
                                    ></path>
                                    <path
                                        data-v-7d63b874=""
                                        d="M448.581 407.13c0 8.27-6.72 14.98-14.99 14.98H317.78v-29.96h115.81c8.27 0 14.991 6.71 14.991 14.98z"
                                        fill="#29376d"
                                    ></path>
                                </svg>
                                Giỏ hàng trống
                            </div>
                            <div className={cx('empty-body-btn')}>
                                <Button to="/">Về trang chủ</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
