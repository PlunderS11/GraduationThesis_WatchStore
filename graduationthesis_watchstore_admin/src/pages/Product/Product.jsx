import classNames from 'classnames/bind';
import styles from './Product.module.scss';
import { productData } from '../../data/dummyData.js';
import { Publish } from '@material-ui/icons';
// import Chart from '../../components/chart/Chart';
import Chart from '~/components/Chart/Chart';
// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import { useEffect, useMemo, useState } from 'react';
// import { userRequest } from '../../requestMethods';

const cx = classNames.bind(styles);

export default function Product() {
    // const location = useLocation();
    // const productId = location.pathname.split('/')[2];
    // const [pStats, setPStats] = useState([]);

    // const product = useSelector((state) => state.product.products.find((product) => product._id === productId));

    // const MONTHS = useMemo(
    //     () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'],
    //     [],
    // );

    // useEffect(() => {
    //     const getStats = async () => {
    //         try {
    //             const res = await userRequest.get('orders/income?pid=' + productId);
    //             const list = res.data.sort((a, b) => {
    //                 return a._id - b._id;
    //             });
    //             list.map((item) => setPStats((prev) => [...prev, { name: MONTHS[item._id - 1], Sales: item.total }]));
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     getStats();
    // }, [productId, MONTHS]);

    return (
        <div className={cx('product')}>
            <div className={cx('product-title-container')}>
                <h1 className={cx('product-title')}>Chỉnh sửa thông tin sản phẩm</h1>
                <Link to="/newproduct">
                    <button className={cx('product-add-button')}>Tạo mới</button>
                </Link>
            </div>
            <div className={cx('product-top')}>
                <div className={cx('product-top-left')}>
                    <Chart data={productData} dataKey="Sales" title="Hiệu suất bán hàng" />
                </div>
                <div className={cx('product-top-right')}>
                    <div className={cx('product-info-top')}>
                        <img
                            src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                            alt=""
                            className={cx('product-info-img')}
                        />
                        <span className={cx('product-name')}>product.title</span>
                    </div>
                    <div className={cx('product-info-bottom')}>
                        <div className={cx('product-info-item')}>
                            <span className={cx('product-info-key')}>ID:</span>
                            <span className={cx('product-info-value')}>SP1001</span>
                        </div>
                        <div className={cx('product-info-item')}>
                            <span className={cx('product-info-key')}>Đã bán:</span>
                            <span className={cx('product-info-value')}>5123</span>
                        </div>
                        <div className={cx('product-info-item')}>
                            <span className={cx('product-info-key')}>Tồn kho:</span>
                            <span className={cx('product-info-value')}>9999</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('product-bottom')}>
                <form className={cx('product-form')}>
                    <div className={cx('product-form-left')}>
                        <label>Tên sản phẩm</label>
                        <input type="text" placeholder="{product.title}" />
                        <label>Mô tả sản phẩm</label>
                        <input type="text" placeholder="{product.desc}" />
                        <label>Giá</label>
                        <input type="text" placeholder="{product.price}" />
                        <label>Tồn kho</label>
                        <select name="inStock" id="idStock">
                            <option value="true">Còn hàng</option>
                            <option value="false">Hết hàng</option>
                        </select>
                    </div>
                    <div className={cx('product-form-right')}>
                        <div className={cx('product-upload')}>
                            <img
                                src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                                alt=""
                                className={cx('product-upload-img')}
                            />
                            <label>
                                <Publish />
                            </label>
                            <input type="file" id="file" style={{ display: 'none' }} />
                        </div>
                        <button className={cx('product-button')}>Cập nhật</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
