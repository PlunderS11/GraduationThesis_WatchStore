import classNames from 'classnames/bind';

import styles from './NewProduct.module.scss';

const cx = classNames.bind(styles);

export default function NewProduct() {
    return (
        <div className={cx('new-product')}>
            <h1 className={cx('add-product-title')}>Thêm mới sản phẩm</h1>
            <form className={cx('add-product-form')}>
                <div className={cx('add-product-item')}>
                    <label>Hình ảnh</label>
                    <input type="file" id="file" />
                </div>
                <div className={cx('add-product-item')}>
                    <label>Tên sản phẩm</label>
                    <input name="title" type="text" placeholder="Apple Airpods" />
                </div>
                <div className={cx('add-product-item')}>
                    <label>Mô tả</label>
                    <input name="desc" type="text" placeholder="description..." />
                </div>
                <div className={cx('add-product-item')}>
                    <label>Giá</label>
                    <input name="price" type="number" placeholder="100" />
                </div>
                <div className={cx('add-product-item')}>
                    <label>Loại</label>
                    <input type="text" placeholder="jeans,skirts" />
                </div>
                <div className={cx('add-product-item')}>
                    <label>Tồn kho</label>
                    <select name="inStock">
                        <option value="true">Còn hàng</option>
                        <option value="false">Hết hàng</option>
                    </select>
                </div>
                <button className={cx('add-product-button')}>Thêm</button>
            </form>
        </div>
    );
}
