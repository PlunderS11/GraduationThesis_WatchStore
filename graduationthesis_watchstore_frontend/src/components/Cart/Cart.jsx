import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { removeItem, selectCartItems, selectTotalItems, selectTotalPrice, updateCartItem } from '../../features/cart';
import style from './Cart.module.scss';
import { Popover } from 'antd';
import Button from '../Button/Button';
import InputNumber from '../InputNumber/InputNumber';

import { useTranslation } from 'react-i18next';
import { NumberWithCommas } from '../../functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const cx = classNames.bind(style);

function Cart({ customClass }) {
    const { t } = useTranslation();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [visiblePopover, setVisiblePopover] = useState(false);

    const user = useSelector(state => state.user);
    const products = useSelector(selectCartItems);
    const totalItem = useSelector(selectTotalItems);
    const price = useSelector(selectTotalPrice);

    // handle scroll to close popover notification
    useEffect(() => {
        const handleClosePopover = () => {
            setVisiblePopover(() => window.scrollY <= 50 && false);
        };
        window.addEventListener('scroll', handleClosePopover);
        return () => {
            window.removeEventListener('scroll', handleClosePopover);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [document.body.scrollTop]);

    useEffect(() => {
        setVisiblePopover(false);
    }, [location.pathname]);

    const handleOpenChange = newOpen => {
        setVisiblePopover(newOpen);
    };

    return (
        <Popover
            trigger={'click'}
            placement="bottomRight"
            open={visiblePopover}
            onOpenChange={handleOpenChange}
            content={
                <div>
                    {products.length > 0 ? (
                        <ul className={cx('cart-items')}>
                            {products?.map(item => (
                                <li key={item.product._id} className={cx('cart-item')}>
                                    <div className={cx('item-contain')}>
                                        <Link to={`/product/${item.product._id}`} className={cx('image-box')}>
                                            <img src={item.product.images[0]} alt={item.name} />
                                        </Link>
                                        <div className={cx('item-detail')}>
                                            <Link to={`/product/${item.product._id}`} className={cx('name')}>
                                                {item.product.name}
                                            </Link>
                                            <p className={cx('price')}>{NumberWithCommas(item.product.finalPrice)}đ</p>
                                            <div className={cx('amount')}>
                                                <span>SL:</span>
                                                <InputNumber
                                                    value={item.quantity}
                                                    onIncrease={() =>
                                                        dispatch(
                                                            updateCartItem({
                                                                product: item.product,
                                                                type: 'increase',
                                                            })
                                                        )
                                                    }
                                                    onDecrease={() =>
                                                        dispatch(
                                                            updateCartItem({
                                                                product: item.product,
                                                                type: 'decrease',
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>
                                            <FontAwesomeIcon
                                                icon={faCircleXmark}
                                                className={cx('remove')}
                                                onClick={() => {
                                                    dispatch(
                                                        removeItem({
                                                            product: item.product,
                                                        })
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <>
                            <p className={cx('empty')}>{t('cart.noItem')}</p>
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
                                {t('cart.emptyCart')}
                            </div>
                        </>
                    )}
                    <div className={cx('total')}>{`${t('cart.total')}: ${NumberWithCommas(price)}đ`}</div>
                    <div className={cx('btns')}>
                        <Button to={'/cart'} customClass={style}>
                            {t('button.gotoCart')}
                        </Button>
                        <Button
                            customClass={style}
                            onclick={() => {
                                if (user.isLogin) {
                                    navigate('/checkout');
                                } else {
                                    navigate('/login');
                                    toast.info(t('productDetail.buynowFail'));
                                }
                            }}
                        >
                            {t('cart.checkout')}
                        </Button>
                    </div>
                </div>
            }
        >
            <div className={cx('cart')}>
                <div className={cx('cart-icon', customClass?.['cart-icon'])}>
                    <div className={cx('cart-amount', customClass?.['cart-amount'])}>{totalItem}</div>
                </div>
            </div>
        </Popover>
    );
}

export default Cart;
