import classNames from 'classnames/bind';
import { LineStyle, PermIdentity, Storefront, AttachMoney, BarChart } from '@material-ui/icons';
import { Link } from 'react-router-dom';

import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

export default function Sidebar() {
    return (
        <div className={cx('sidebar')}>
            <div className={cx('sidebar-wrapper')}>
                <div className={cx('sidebar-menu')}>
                    <h3 className={cx('sidebar-title')}>CHỨC NĂNG</h3>
                    <ul className={cx('sidebar-list')}>
                        <Link to="/" className="link">
                            <li className={cx('sidebar-list-item', 'active')}>
                                <LineStyle className={cx('sidebar-icon')} />
                                Trang chủ
                            </li>
                        </Link>
                        <Link to="/users" className="link">
                            <li className={cx('sidebar-list-item')}>
                                <PermIdentity className={cx('sidebar-icon')} />
                                Khách hàng
                            </li>
                        </Link>
                        <Link to="/products" className="link">
                            <li className={cx('sidebar-list-item')}>
                                <Storefront className={cx('sidebar-icon')} />
                                Sản phẩm
                            </li>
                        </Link>
                        <Link to="/" className="link">
                            <li className={cx('sidebar-list-item')}>
                                <AttachMoney className={cx('sidebar-icon')} />
                                Hóa đơn
                            </li>
                        </Link>
                        <Link to="/" className="link">
                            <li className={cx('sidebar-list-item')}>
                                <BarChart className={cx('sidebar-icon')} />
                                Thống kê
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    );
}
