import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Col, Divider, Modal, Row, Spin } from 'antd';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import { loadStripe } from '@stripe/stripe-js';

import { clearCart, fetchEstimate, selectCartItems, selectTotalItems } from '../../features/cart';
import { NumberWithCommas } from '../../functions';
import Button from '../../components/Button/Button';
import styles from './Checkout.module.scss';
import TextArea from 'antd/es/input/TextArea';
import axiosClient from '../../api/axiosClient';
import { fetchUserInfor } from '../../features/user';
import MyBreadcrumb from '../../components/Breadcrumb/MyBreadcrumb';
import i18n from '../../i18n';
import { clearPromotionCode } from '../../features/cart/cartSlice';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE);

const cx = classNames.bind(styles);

const Checkout = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [check, setCheck] = useState('CASH');
    const [open, setOpen] = useState(false);

    const [note, setNote] = useState('');
    const [coupon, setCoupon] = useState('');
    const user = useSelector(state => state.user);
    const estimate = useSelector(state => state.cart.estimate);
    const loading = useSelector(state => state.cart.isLoadingCart);
    const cart = useSelector(selectCartItems);
    const totalItems = useSelector(selectTotalItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingBuy, setIsLoadingBuy] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    const getSecretClientPayment = async () => {
        const { data } = await axiosClient.post('order/payment-intent', {
            amount: estimate.finalPrice,
        });
        return data.clientSecret;
    };

    const handleShowPaymentForm = async () => {
        const clientSecretData = await getSecretClientPayment();
        setClientSecret(clientSecretData);
        setOpen(true);
    };

    const payment = [
        {
            type: 'CASH',
            content: t('checkout.cod'),
            des: t('checkout.descriptionCOD'),
        },
        {
            type: 'ONLINE',
            content: t('checkout.online'),
            des: t('checkout.descriptionOnl'),
        },
    ];

    useEffect(() => {
        if (user.isLogin && totalItems > 0) {
            dispatch(fetchEstimate());
            dispatch(fetchUserInfor());
        }
        localStorage.getItem('promotionCode') && setCoupon(JSON.parse(localStorage.getItem('promotionCode')));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChonse = type => {
        setCheck(type);
    };

    const handleBuy = async () => {
        if (user.user.address?.address === undefined) {
            toast.info(t('checkout.noAddress'));
            navigate('/account/address', { state: true });
        } else {
            setIsLoadingBuy(true);
            try {
                const resUser = await axiosClient.get('user/userInfo');
                await axiosClient.post('order', {
                    province: resUser.data.address.province,
                    district: resUser.data.address.district,
                    ward: resUser.data.address.ward,
                    distancePrice: estimate.distancePrice,
                    promotionCode: coupon,
                    note,
                    products: cart.reduce((acc, cur) => {
                        acc.push({
                            productId: cur.product._id,
                            quantity: cur.quantity,
                        });
                        return acc;
                    }, []),
                    paymentType: check,
                    phone: resUser.data.phone,
                    address: resUser.data.address.address,
                    username: resUser.data.username,
                    language: i18n.language,
                });
                dispatch(clearCart());
                toast.success(t('checkout.buySuccess'));
                navigate('/buysuccess');
            } catch (error) {
                toast.error(error.response.data.message);
            } finally {
                setIsLoadingBuy(false);
            }
        }
    };

    const handleBuyOnline = async () => {
        if (user.user.address?.address === undefined) {
            toast.info(t('checkout.noAddress'));
            navigate('/account/address', { state: true });
        } else {
            setIsLoadingBuy(true);
            try {
                const resUser = await axiosClient.get('user/userInfo');
                await axiosClient.post('order/stripePayment', {
                    province: resUser.data.address.province,
                    district: resUser.data.address.district,
                    ward: resUser.data.address.ward,
                    distancePrice: estimate.distancePrice,
                    promotionCode: coupon,
                    note,
                    products: cart.reduce((acc, cur) => {
                        acc.push({
                            productId: cur.product._id,
                            quantity: cur.quantity,
                        });
                        return acc;
                    }, []),
                    paymentType: check,
                    phone: resUser.data.phone,
                    address: resUser.data.address.address,
                    username: resUser.data.username,
                    language: i18n.language,
                });
                dispatch(clearCart());
                toast.success(t('checkout.buySuccess'));
                navigate('/buysuccess');
            } catch (error) {
                console.log(error);
                toast.error(error.response.data.message);
            } finally {
                setIsLoadingBuy(false);
            }
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    // Apply discount code
    const handleOk = async () => {
        dispatch(fetchEstimate(coupon));
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Spin spinning={loading}>
            <div className={cx('checkout-page')}>
                <div className="page-header">
                    <div className="container">
                        <MyBreadcrumb />
                        <div className={cx('title')}>
                            <h1>{t('breadcrumbs.checkout')}</h1>
                        </div>
                    </div>
                </div>
                {totalItems > 0 ? (
                    <div className="container">
                        <Row>
                            <Col
                                span={window.innerWidth < 450 ? 24 : 14}
                                style={{ paddingRight: window.innerWidth < 450 ? '0px' : '15px' }}
                            >
                                <div className={cx('note')}>
                                    <div className={cx('body')}>
                                        <div className={cx('body-title')}>{t('cart.note')}</div>
                                        <div className={cx('body-form')}>
                                            <TextArea
                                                onChange={e => setNote(e.target.value)}
                                                value={note}
                                                rows={4}
                                                placeholder={t('cart.notePlace')}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('infor')}>
                                    <div className={cx('address')}>
                                        <div className={cx('change')}>
                                            <span style={{ fontWeight: 600 }}>{t('cart.toAddress')}</span>
                                            <div
                                                className={cx('change-a')}
                                                onClick={() => navigate('/account/address', { state: true })}
                                            >
                                                {t('cart.changeAddress')}
                                            </div>
                                        </div>
                                        <div className={cx('add')}>
                                            {user.user.address?.address ? (
                                                <>
                                                    <div
                                                        className={cx('address-add-phone')}
                                                    >{`${user.user.address?.name} | ${user.user.address?.phone}`}</div>
                                                    <div className={cx('address-add-address')}>
                                                        {`${user.user.address?.address}, ${user.user.address?.ward.WardName}, ${user.user.address?.district.DistrictName}, ${user.user.address?.province.NameExtension[1]}`}
                                                    </div>
                                                </>
                                            ) : (
                                                <Link to={'/account/address'}>+ {t('cart.addAddress')}</Link>
                                            )}
                                        </div>
                                    </div>
                                    {/* Modal coupon */}
                                    <Modal
                                        title={t('cart.storePromotion')}
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
                                                    placeholder=""
                                                    value={coupon}
                                                    onChange={e => setCoupon(e.target.value)}
                                                />
                                                <Button
                                                    style={{ fontSize: '1.3rem', fontWeight: 600 }}
                                                    onclick={handleOk}
                                                >
                                                    {t('button.apply')}
                                                </Button>
                                            </div>
                                            <div className={cx('modal__text')}>
                                                <div className={cx('modal__label')}>{t('cart.promotionCode')}</div>
                                                {estimate?.discountPrice > 0 ? (
                                                    <span>
                                                        {t('cart.promotioPrice')}&nbsp;
                                                        {NumberWithCommas(estimate?.discountPrice)} &nbsp;₫
                                                    </span>
                                                ) : (
                                                    <span>{t('cart.promotioNull')}!</span>
                                                )}
                                            </div>
                                        </div>
                                    </Modal>
                                    <div className={cx('coupon')}>
                                        <div className={cx('change')}>
                                            <span style={{ fontWeight: 600 }}>{t('cart.storePromotion')}</span>
                                            <div
                                                className={cx('change-a')}
                                                onClick={() => {
                                                    dispatch(clearPromotionCode());
                                                    dispatch(fetchEstimate());
                                                }}
                                            >
                                                {t('checkout.remove')}
                                            </div>
                                        </div>
                                        <div className={cx('coupon-chonse')} onClick={showModal}>
                                            {estimate?.discountPrice > 0 ? (
                                                <>
                                                    {t('cart.promotioPrice')}&nbsp;
                                                    {NumberWithCommas(estimate?.discountPrice)} &nbsp;₫
                                                </>
                                            ) : (
                                                <>
                                                    <img
                                                        src="https://hebec.vn/images/coupon_icon.svg"
                                                        alt=""
                                                        style={{ marginRight: '4px' }}
                                                    />
                                                    {t('cart.chocePromotion')}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col
                                span={window.innerWidth < 450 ? 24 : 10}
                                style={{ paddingLeft: window.innerWidth < 450 ? '0px' : '15px' }}
                            >
                                <div className={cx('note')}>
                                    <div className={cx('body')}>
                                        <div className={cx('body-title')}>{t('checkout.itemsPrice')}</div>
                                        <div className={cx('body-form')}>
                                            <div className={cx('form-calculate-title')}>
                                                <span className={cx('form-calculate-title-text')}>
                                                    {t('table.product')}
                                                </span>
                                                <span className={cx('form-calculate-title-text')}>
                                                    {t('table.total')}
                                                </span>
                                            </div>
                                            <Divider style={{ margin: '0' }} />
                                            <div className={cx('body-list')}>
                                                {cart.map((item, i) => (
                                                    <div key={i} className={cx('body-item')}>
                                                        <p className={cx('text')} style={{ padding: '20px 0 0 8px' }}>
                                                            {item.product.name} x {item.quantity}
                                                        </p>
                                                        <p className={cx('text')} style={{ padding: '20px 8px 0 0' }}>
                                                            {NumberWithCommas(item.product.finalPrice * item.quantity)}
                                                            &nbsp;₫
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className={cx('form-calculate-title')}>
                                                <Link to={'/cart'} className={cx('link')}>
                                                    {t('checkout.changeCart')}
                                                </Link>
                                            </div>
                                            <Divider style={{ margin: '0' }} />
                                            <div className={cx('form-calculate-title')}>
                                                <span className={cx('form-calculate-title-text')}>
                                                    {t('cart.estimate')}
                                                </span>
                                                <p className={cx('text')} style={{ padding: '10px 8px 0 0' }}>
                                                    {estimate.totalPrice ? NumberWithCommas(estimate?.totalPrice) : 0}
                                                    &nbsp;₫
                                                </p>
                                            </div>
                                            <div className={cx('form-calculate-title')}>
                                                <span className={cx('form-calculate-title-text')}>
                                                    {t('cart.distancePrice')}
                                                </span>
                                                <p className={cx('text')} style={{ padding: '10px 8px 0 0' }}>
                                                    {estimate.distancePrice
                                                        ? NumberWithCommas(estimate?.distancePrice)
                                                        : 0}
                                                    &nbsp;₫
                                                </p>
                                            </div>
                                            <div className={cx('form-calculate-title')}>
                                                <span className={cx('form-calculate-title-text')}>
                                                    {t('cart.discountPrice')}
                                                </span>
                                                <p
                                                    className={cx('text')}
                                                    style={{ padding: '10px 8px 0 0', color: '#47991f' }}
                                                >
                                                    -
                                                    {estimate.discountPrice
                                                        ? NumberWithCommas(estimate?.discountPrice)
                                                        : 0}
                                                    &nbsp;₫
                                                </p>
                                            </div>
                                            <div className={cx('form-total')} style={{ padding: '10px 0 0 8px' }}>
                                                <h2>{t('cart.totalPrice')}:&nbsp;</h2>
                                                <h2 style={{ color: '#ff424e' }}>
                                                    {estimate.finalPrice ? NumberWithCommas(estimate.finalPrice) : 0}
                                                    &nbsp;₫
                                                </h2>
                                            </div>
                                        </div>
                                        <div className={cx('payment')}>
                                            <ul>
                                                {payment.map((item, i) => (
                                                    <li
                                                        key={i}
                                                        className={cx('item', { check: check === item.type })}
                                                        onClick={() => handleChonse(item.type)}
                                                    >
                                                        <div className={cx('item-label')}>
                                                            <span className={cx('isCheck')}></span>
                                                            <span>{item.content}</span>
                                                        </div>
                                                        <div className={cx('item-des')}>{item.des}</div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            {check === 'CASH' ? (
                                                <Button customClass={styles} loading={isLoadingBuy} onclick={handleBuy}>
                                                    {t('button.order')}
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button customClass={styles} onclick={handleShowPaymentForm}>
                                                        {t('button.order')}
                                                    </Button>
                                                    <Modal
                                                        open={open}
                                                        onCancel={() => {
                                                            setOpen(false);
                                                        }}
                                                        centered
                                                        footer={null}
                                                    >
                                                        {clientSecret && (
                                                            <div className="">
                                                                <Elements
                                                                    stripe={stripePromise}
                                                                    options={{
                                                                        clientSecret,
                                                                    }}
                                                                >
                                                                    <PaymentForm handleBuyOrder={handleBuyOnline} />
                                                                </Elements>
                                                            </div>
                                                        )}
                                                    </Modal>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                ) : (
                    <div className={cx('empty')}>
                        <div className={cx('container')}>
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
                                        <circle
                                            data-v-7d63b874=""
                                            cx="235.944"
                                            cy="467.057"
                                            fill="#f0f7ff"
                                            r="15"
                                        ></circle>
                                        <circle
                                            data-v-7d63b874=""
                                            cx="395.493"
                                            cy="467.057"
                                            fill="#dfe7f4"
                                            r="15"
                                        ></circle>
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
        </Spin>
    );
};

export default Checkout;
