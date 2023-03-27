import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { NumberWithCommas } from '../../functions';
import style from './ProductCard.module.scss';

const cx = classNames.bind(style);

function ProductCard({ product, customClass }) {
    const { t } = useTranslation();

    return (
        <Link to={`/product/${product._id}`} className={cx('product-card')}>
            <div className={cx('product-images', customClass?.['product-images'])}>
                <img src={product.images[0]} alt={product.name} />
                {product.images[1] && <img src={product.images[1]} alt={product.name} className={cx('image-hover')} />}
            </div>
            <h3 className={cx('product-name', customClass?.['product-name'])}>{product.name}</h3>
            <p className={cx('product-price', customClass?.['product-price'])}>
                {product.stock > 0 ? `${NumberWithCommas(product.finalPrice)}đ` : t('productCard.outOfStock')}
            </p>
        </Link>
    );
}

export default ProductCard;
