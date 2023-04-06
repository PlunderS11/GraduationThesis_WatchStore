import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { removeItem, selectCartItems, selectTotalItems, selectTotalPrice, updateCartItem } from '../../features/cart';
import style from './Cart.module.scss';
import { Popover } from 'antd';
import Button from '../Button/Button';
import InputNumber from '../InputNumber/InputNumber';

import { useTranslation } from 'react-i18next';
import { NumberWithCommas } from '../../functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(style);

function Cart({ customClass, open }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const products = useSelector(selectCartItems);
    const totalItem = useSelector(selectTotalItems);
    const price = useSelector(selectTotalPrice);

    return (
        <Popover
            trigger={'click'}
            placement="bottomRight"
            // open={open && false}
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
                        <p className={cx('empty')}>{t('cart.noItem')}</p>
                    )}
                    <div className={cx('total')}>{`${t('cart.total')}: ${NumberWithCommas(price)}đ`}</div>
                    <div className={cx('btns')}>
                        <Button to={'/cart'} customClass={style}>
                            {t('button.gotoCart')}
                        </Button>
                        <Button to={'/checkout'} customClass={style}>
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
