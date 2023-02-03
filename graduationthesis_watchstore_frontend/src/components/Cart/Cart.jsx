// import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

// import Button from '~/components/Button';
// import InputNumber from '~/components/InputNumber';
// import {
//     changeStatus,
//     removeItem,
//     selectCartItems,
//     selectShowStatus,
//     selectTotalItems,
//     selectTotalPrice,
//     updateCartItem,
// } from '~/features/cart';
// import { NumberWithCommas } from '~/functions';
import style from './Cart.module.scss';

const cx = classNames.bind(style);

function Cart({ customClass }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const location = useLocation();

    // const products = useSelector(selectCartItems);
    // const totalItem = useSelector(selectTotalItems);
    // const totalPrice = useSelector(selectTotalPrice);
    // const showStatus = useSelector(selectShowStatus);

    // useEffect(() => {
    //     if (showStatus === true) {
    //         dispatch(changeStatus({ status: false }));
    //     }
    //     // eslint-disable-next-line
    // }, [dispatch, location.pathname]);

    return (
        <Link to="/checkout">
            <div className={cx('cart')}>
                <div className={cx('cart-icon', customClass?.['cart-icon'])}>
                    <div className={cx('cart-amount', customClass?.['cart-amount'])}>10</div>
                </div>
            </div>
        </Link>
    );
}

export default Cart;
