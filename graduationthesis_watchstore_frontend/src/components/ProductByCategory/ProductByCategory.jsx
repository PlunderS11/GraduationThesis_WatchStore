import classNames from 'classnames/bind';

import ProductCard from '../ProductCard/ProductCard';
import i18n from '../../i18n';
import style from './ProductByCategory.module.scss';

const cx = classNames.bind(style);

function ProductByCategory({ title, descriptionvi, descriptionen, listProduct, column = 3 }) {
    return (
        <>
            {listProduct && listProduct.length > 0 && (
                <div className={cx('product-by-category')}>
                    <h2 className={cx('title')}>{title}</h2>
                    <p className={cx('description')}>{i18n.language === 'vi' ? descriptionvi : descriptionen}</p>
                    <ul className={cx('product-list')}>
                        {listProduct.map(item => (
                            <li key={item._id} style={{ '--column': column }} className={cx('product-item')}>
                                <ProductCard product={item} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

export default ProductByCategory;
