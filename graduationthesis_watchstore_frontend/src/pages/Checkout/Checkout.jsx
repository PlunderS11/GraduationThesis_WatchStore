import classNames from 'classnames/bind';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NumberWithCommas } from '../../functions';
import Button from '../../components/Button/Button';
import style from './Checkout.module.scss';

const cx = classNames.bind(style);

const product = [
    {
        id: 39,
        type: 'wacth',
        sex: true,
        brand: 'Dyoss',
        size: 34,
        strap: 'metal',
        color: 'black',
        image: 'https://www.dyoss.com/app/uploads/2017/07/upweb_gocchinh12.jpg',
        link: 'mystique-rose-rose-mesh-34',
        name: 'Gatsby - Matte/Mesh/36',
        price: 3100000,
        stock: 0,
        amount: 2,
    },
    {
        id: 20,
        type: 'wacth',
        sex: true,
        brand: 'Dyoss',
        size: 34,
        strap: 'metal',
        color: 'black',
        image: 'https://www.dyoss.com/app/uploads/2019/06/02.jpg',
        link: 'mystique-rose-rose-mesh-34',
        name: 'Mystique - Rose/Rose Mesh/34',
        price: 3100000,
        stock: 72,
        amount: 2,
    },
    {
        id: 3,
        type: 'wacth',
        sex: true,
        brand: 'Dyoss',
        size: 34,
        strap: 'metal',
        color: 'black',
        image: 'https://www.dyoss.com/app/uploads/2017/07/upweb_gocchinh_15-1.jpg',
        link: 'iconic-black-brown-40',
        name: 'Iconic - Black/Brown/40',
        price: 2890000,
        stock: 0,
        amount: 2,
    },
];

const Checkout = () => {
    const { t } = useTranslation();

    const products = product;
    const totalItems = 2;
    return (
        <div className={cx('checkout-page')}>
            <div className={cx('container')}>
                <h1 className={cx('title')}>
                    <Trans i18nKey="checkout.orderTitle">{{ totalItems }}</Trans>
                </h1>
                <div className={cx('content')}>
                    {products.length > 0 && (
                        <>
                            <ul className={cx('list-products')}>
                                {products.map(product => (
                                    <li key={product.id} className={cx('product-item')}>
                                        <Link to={`/product/${product.link}`} className={cx('image-box')}>
                                            <img src={product.image} alt={product.name} />
                                        </Link>
                                        <div className={cx('item-content')}>
                                            <Link to={`/product/${product.link}`} className={cx('name')}>
                                                {product.name}
                                            </Link>
                                            {/* <div className={cx('options')}>
                                                {Object.values(product.option).map((obj, index) => (
                                                    <p key={index}>{obj.name}</p>
                                                ))}
                                            </div> */}
                                            <p className={cx('price')}>
                                                {t('checkout.unitPrice')}:{' '}
                                                <span>{NumberWithCommas(product.price)}đ</span>
                                            </p>
                                            <div className={cx('amount')}>
                                                <p>{t('checkout.quantity')}:</p>
                                                <div className={cx('input-number')}>
                                                    <div className={cx('input')}>
                                                        <span>{product.amount}</span>
                                                    </div>
                                                    <div className={cx('buttons')}>
                                                        <span
                                                            className={cx('decrease')}
                                                            onClick={() => {
                                                                alert('giam');
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faMinus} />
                                                        </span>
                                                        <span className={cx('increase')} onClick={() => alert('tang')}>
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cx('total')}>
                                                {t('checkout.total')}:{' '}
                                                <span>{NumberWithCommas(product.price * product.amount)}đ</span>
                                            </div>
                                        </div>
                                        <div
                                            className={cx('remove')}
                                            onClick={
                                                () => alert('xoa')
                                                // dipatch(removeItem({ cartId: product.cartId }))
                                            }
                                        >
                                            {t('checkout.remove')}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    <div className={cx('summary')}>
                        <div className={cx('summary-title')}>{t('checkout.checkout')}</div>
                        <div className={cx('summary-detail')}>
                            <div className={cx('summary-price')}>
                                <span>{t('checkout.itemsPrice')}</span>
                                <span>{NumberWithCommas(16000000)}đ</span>
                            </div>
                            <div className={cx('summary-price')}>
                                <span>{t('checkout.shippingPrice')}</span>
                                <span>{NumberWithCommas(50000)}đ</span>
                            </div>
                        </div>
                        <div className={cx('summary-total')}>
                            <span>{t('checkout.total')}</span>
                            <span>{NumberWithCommas(16000000 + 50000)}đ</span>
                        </div>
                        <Button type="submit" customClass={style}>
                            {t('button.order')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
