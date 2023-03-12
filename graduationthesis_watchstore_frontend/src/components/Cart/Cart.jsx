import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectTotalItems } from '../../features/cart';
import style from './Cart.module.scss';

const cx = classNames.bind(style);

function Cart({ customClass }) {
    const totalItem = useSelector(selectTotalItems);

    return (
        <Link to="/checkout">
            <div className={cx('cart')}>
                <div className={cx('cart-icon', customClass?.['cart-icon'])}>
                    <div className={cx('cart-amount', customClass?.['cart-amount'])}>{totalItem}</div>
                </div>
            </div>
        </Link>
    );
}

export default Cart;
